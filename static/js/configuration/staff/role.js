/**
 * time: 2018/01/02
 */
roleAcctTreeLayer
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'formSelects', 'jquery','laypage'], function() {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl,
        $ = layui.$,
        laypage = layui.laypage,
        formSelects = layui.formSelects,
        admin = layui.admin;

    var roleResourceXTree, roleResourceXTree1, roleAcctXTree, roleAcctXTree1
    // 表格渲染
    table.render({
        elem: '#rolemanagerTable',
        method: 'post',
        url: ctx + '/sys/sysRolePage.html',
        cols: [
            [
                //标题栏
                { field: 'name', title: '角色名称' },
                { title: '内置', align: 'center', toolbar: '#roleIsBuildInBar', width: 70 },
                { field: 'remark', title: '备注' },
                { field: 'sort', title: '排序号',width: 70 },
                { title: '操作', width: 350,toolbar: '#roleOperBar' }
            ],
        ],
        page: true,
        id: 'sysRoleTable',
        limits: [20, 50, 100],
        limit: 100,
        done: function(){
        }
    })
    form.render('select');

    function ajaxSortSysRole(data) {
        $.ajax({
            type: 'post',
            url: ctx + '/sys/sortRole.html',
            dataType: 'json',
            data: {
                id: data.id,
                newSort: data.newSort
            },
            success: function (returnData) {
                if (returnData.code == '0000') {
                    layer.msg('操作成功')
                    table.reload('sysRoleTable');
                    layer.closeAll()
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function () {
                layer.msg('发送请求失败')
            }
        })
    }


    var active = {
        //搜索
        reload: function() {
            var name = $.trim($('#roleSearchForm #name').val())
            table.reload('sysRoleTable', {
                page: { curr: 1 },
                where: {
                    name: name,
                    status: $('#roleStatusSel').val()
                }
            })
        }
    }

    $('#roleSearchBtn').on('click', function() {
        var type = $(this).data('type')
        active[type] ? active[type].call(this) : ''
    })

    //添加角色弹窗
    $('#addRoleBtn').click(function() {
        var index = layer.open({
            type: 1,
            title: '添加角色',
            // shade: 0, //遮罩透明度
            shadeClose: false,
            area: ['800px', '500px'],
            content: $('#addRoleLayer').html(),
            end: function() {
                // $("#addRoleForm")[0].reset();
                $('#addRoleForm').trigger('reset')
            },
            btn: ['确定', '取消'],
            yes: lms_debounce(function(index, layero) {
                $('#addRoleForm #submitAddRole')[1].click()
            }, 1000)

        })
    })

    //添加角色
    form.on('submit(addRole)', function(data) {
        $.ajax({
            type: 'post',
            url: ctx + '/sys/addRole.html',
            dataType: 'json',
            data: data.field,
            beforeSend: function () {
                loading.show() 
            },
            success: function(returnData) {
                loading.hide();
                if (returnData.code == '0000') {
                    layer.closeAll()
                    active['reload'].call()
                    layer.msg('添加角色成功')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                loading.hide();
                layer.msg('发送请求失败')
            }
        })
        return false
    })

    //自定义验证规则
    form.verify({
        unique: function(value, item) {
            var id = $(item).closest('form').find('input[name=\'id\']').val()
            var isUnique = true
            $.ajax({
                type: 'post',
                url: ctx + '/sys/checkRoleNameUnique.html',
                data: { 'roleName': value, 'id': id },
                dataType: 'json',
                async: false,
                success: function(returnData) {
                    if (returnData.code != '0000') {
                        //此处return不起作用
                        isUnique = false
                    }
                }
            })
            if (!isUnique) {
                return '角色名称已存在'
            }
        }
    })

    // 1.increaseStoreAcct新增授权的数据，2.decreaseStoreAcct移除授权的数据
    var increaseStoreAcct = [],decreaseStoreAcct = [],currentPageAllData = 1,limitAllData = 100;

    // 授予店铺 -- 获取已授予true和未授予false店铺信息
    function renderacctTreeLayerTable(number,page,limit){
        let boolean;
        number == 1?boolean=false:boolean=true;
        let searchCondition = $("#role_searchCondition" + number).val();
        searchCondition = searchCondition.replace(/，/g, ",");//兼容中文逗号
        const platCodes = formSelects.value(`role_searchCondition${number}_platcode`,'valStr')
        $.ajax({
            type: "post",
            url: ctx + "/sys/v2/listPlatAccByRoleOrUser.html",
            data: {
                "auth":boolean,
                "roleId":$("#role_input_userid").val(),
                "searchCondition":searchCondition,
                'limit':limit,
                'page':page,
                platCodes
            },
            success: function(data) {
                let returnData = data
                if(returnData.code === "0000") {
                    returnData.data
                    // increaseStoreAcct = increaseStoreAcct.filter(items => data.id !=items.id)
                    // decreaseStoreAcct = decreaseStoreAcct.concat([data])
                    // 未授权店铺表新增 移除添加授权数据，删掉移除授权数据
                    // 已授权新增 移除授权数据，删掉添加授权数据
                    // number == 1?rendertable1(returnData):rendertable2(returnData);
                    let increaseStoreAcctids = increaseStoreAcct.map(item => item.id)
                    let decreaseStoreAcctids = decreaseStoreAcct.map(item => item.id)
                    if(number === 1){  // 刷新表格时，前端把未授权/已授权的数据过滤/新增
                        returnData.data = returnData.data.filter(items => !increaseStoreAcctids.includes(items.id))
                        returnData.data = returnData.data.concat(decreaseStoreAcct)
                        rendertable1(returnData, limit)
                        laypage.render({
                            elem: 'roleacctTreeLayerTablepage' + number,
                            limit: limit,
                            limits: [100, 200, 500],
                            first: false
                            , last: false,
                            layout: ['prev', 'page', 'next', 'count', 'limit'],
                            curr:currentPageAllData,
                            count: data.count,
                            groups: 3,
                            jump: function (obj, first) {
                                currentPageAllData = obj.curr;
                                limitAllData = obj.limit;
            
                                //首次不执行
                                if (!first) {
                                    renderacctTreeLayerTable(number, obj.curr, obj.limit)
                                }
                            }
                        })
                    }else{
                        returnData.data = returnData.data.filter(items => !decreaseStoreAcctids.includes(items.id))
                        returnData.data = returnData.data.concat(increaseStoreAcct)
                        rendertable2(returnData)
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        })
    }

    function rendertable1(res,limit){
        table.render({
            elem: "#roleacctTreeLayerTable1",
            size:'sm',
            cols: [
                [
                    //标题栏
                    {type: 'checkbox'},
                    {
                        field: "platCode",
                        title: "平台"
                    },
                    {
                        field: "storeAcct",
                        title: "店铺名"
                    },
                    {
                        title: '操作',
                        toolbar: '#roleacctTreeLayerTableBtn1',
                    }
                ]
            ],
            data:res.data,
            id: "roleacctTreeLayerTable1",
            page:false,
            limit:limit
        });
    }

    function rendertable2(res){
        table.render({
            elem: "#roleacctTreeLayerTable2",
            size:'sm',
            cols: [
                [
                    //标题栏
                    {type: 'checkbox'},
                    {
                        field: "platCode",
                        title: "平台"
                    },
                    {
                        field: "storeAcct",
                        title: "店铺名"
                    },
                    {
                        title: '操作',
                        toolbar: '#roleacctTreeLayerTableBtn2',
                    }
                ]
            ],
            data:res.data,
            id: "roleacctTreeLayerTable2",
            // page:false,
            limit:10000
        });
    }

    // 监听复选框已选择的数据
    function watchCheckd(){
        let checkStatus1 = table.checkStatus('roleacctTreeLayerTable1'); //获取选择的店铺
        let checkStatus2 = table.checkStatus('roleacctTreeLayerTable2'); //获取选择的店铺
        $('#role_layerform1 span[name="checkData"]').text(checkStatus1.data.length);
        $('#role_layerform2 span[name="checkData"]').text(checkStatus2.data.length);
    }


    // table1监听复选框事件
    table.on('checkbox(roleacctTreeLayerTable2)', function(obj) {
        let checkStatus2 = table.checkStatus('roleacctTreeLayerTable2'); //获取选择的店铺
        $('#role_layerform2 span[name="checkData"]').text(checkStatus2.data.length);
    });

    // table1监听复选框事件
    table.on('checkbox(roleacctTreeLayerTable1)', function(obj) {
        let checkStatus1 = table.checkStatus('roleacctTreeLayerTable1'); //获取选择的店铺
        $('#role_layerform1 span[name="checkData"]').text(checkStatus1.data.length);
    });


// 监听表格移除授权操作
    table.on('tool(roleacctTreeLayerTable1)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'create') {
            organcreateData([data])
            decreaseStoreAcct = decreaseStoreAcct.filter(items => data.id != items.id)
            increaseStoreAcct = increaseStoreAcct.concat([data])
        }
    })

    // 监听表格移除授权操作
    table.on('tool(roleacctTreeLayerTable2)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'delete') {
            organdeleteData([data])
            increaseStoreAcct = increaseStoreAcct.filter(items => data.id !=items.id)
            decreaseStoreAcct = decreaseStoreAcct.concat([data])
        }
    })

    // 重新渲染数据表格
    function organcreateData(ceratedata){
        let data1 = layui.table.cache["roleacctTreeLayerTable1"], // table1当前页的数据
            data2 = layui.table.cache["roleacctTreeLayerTable2"]; // table2当前页的数据
        let checkStatus1Id = ceratedata.map(item=>item.id); // 需要添加授权的id
        if(data1) {
            data1 = data1.filter(item => !checkStatus1Id.includes(item.id)) // data1移除数据
        }
        data2 = ceratedata.concat(data2) // data2添加数据
        table.reload('roleacctTreeLayerTable1', {
            data:data1,
        });
        table.reload('roleacctTreeLayerTable2', {
            data:data2,
        });
        watchCheckd();
    }

    //  重新渲染数据表格
    function organdeleteData(deletedata){
        let data1 = layui.table.cache["roleacctTreeLayerTable1"],// table1当前页的数据
            data2 = layui.table.cache["roleacctTreeLayerTable2"];// table2当前页的数据
        let checkStatus2Id = deletedata.map(item=>item.id);// 需要移除授权的id

        if(data2){
            data2=data2.filter(item=>!checkStatus2Id.includes(item.id))// data2移除数据
        }
        data1 = deletedata.concat(data1)// data1添加数据
        table.reload('roleacctTreeLayerTable1', {
            data:data1
        });
        table.reload('roleacctTreeLayerTable2', {
            data:data2
        });
        watchCheckd();
    }

    // 添加授权的方法
    function addauthorization(){
        let checkStatus1 = table.checkStatus('roleacctTreeLayerTable1'); //获取选择的店铺
        if(checkStatus1.data.length == 0){
            layer.alert("请选择需要添加授权的店铺");
            return false;
        }
        let checkStatus1Id = checkStatus1.data.map(item=>item.id);// 需要移除授权的id
        organcreateData(checkStatus1.data);

        decreaseStoreAcct = decreaseStoreAcct.filter(items => !checkStatus1Id.includes(items.id))
        let checkStatus1data = checkStatus1.data;
        increaseStoreAcct = increaseStoreAcct.concat(checkStatus1data)
    }

    // 删除授权的方法
    function deleteauthorization(){
        let checkStatus2 = table.checkStatus('roleacctTreeLayerTable2'); //获取选择的店铺
        if(checkStatus2.data.length == 0){
            layer.alert("请选择需要移除授权的店铺");
            return false;
        }
        let checkStatus2Id = checkStatus2.data.map(item=>item.id);// 需要移除授权的id
        organdeleteData(checkStatus2.data);
        increaseStoreAcct = increaseStoreAcct.filter(items => !checkStatus2Id.includes(items.id))
        let checkStatus2data = checkStatus2.data;
        decreaseStoreAcct = decreaseStoreAcct.concat(checkStatus2data)
    }

    // 批量添加授权
    $(document).on("click","#role_add_authorization",function(){
        addauthorization();
    })

    // 批量移除授权
    $(document).on("click","#role_delete_authorization",function(){
        deleteauthorization();
    })

    // 授予店铺--搜索
    $(document).on("click","#roleSearchBtn1",function(){
        renderacctTreeLayerTable(1,1,limitAllData);
    })

    // 授予店铺--搜索
    $(document).on("click","#roleSearchBtn2",function(){
        renderacctTreeLayerTable(2,-1,-1);
    })

    // 将授权或未授权的店铺以excel形式写入响应 0-根据userId未授权店铺, 1-根据userId已授权店铺  2-根据roleId未授权  3-根据roleId已授权
    // 导出
    $(document).on("click","#roleExportBtn1",function(){
        transBlob({
            fileName: '未授权店铺.xlsx',
            url: ctx + "/sysuser/download/excel/acctAuth/2/" + $("#role_input_userid").val(),
            // formData: formData
        },'get').then(function(result){
            layer.alert(result, {icon: 1});
        }).catch(function(err){
            layer.alert(err, {icon: 2});
        })
    })


    // 导出
    $(document).on("click","#roleExportBtn2",function(){
        transBlob({
            fileName: '已授权店铺.xlsx',
            url: ctx + "/sysuser/download/excel/acctAuth/3/" + $("#role_input_userid").val(),
            // formData: formData
        },'get').then(function(result){
            layer.alert(result, {icon: 1});
        }).catch(function(err){
            layer.alert(err, {icon: 2});
        })
    })
    // 授予店铺 -- 渲染页面分页
    function allstatusOrderPage(number){
        let boolean;
        number == 1?boolean=false:boolean=true;
        let searchCondition = $("#role_searchCondition" + number).val();
        searchCondition = searchCondition.replace(/，/g, ",");//兼容中文逗号

        $.ajax({
            type: "post",
            url: ctx + "/sys/v2/listPlatAccByRoleOrUser.html",
            data: {
                "auth":boolean,
                "userId":$("#role_input_userid").val(),
                "searchCondition":searchCondition,
                'limit':100,
            },
            success: function(data) {
                let returnData = data;
                if(returnData.code === "0000") {
                    localStorage.setItem("roleTableCount" + number,returnData.count)
                    laypage.render({
                        elem: 'roleacctTreeLayerTablepage'+ number,
                        limit:100,
                        limits: [100, 200, 500],
                        first: false
                        ,last: false,
                        layout: ['prev', 'page', 'next', 'count','limit'],
                        count: localStorage.getItem("roleTableCount" + number),
                        groups:3,
                        jump: function(obj, first) {
                            //首次不执行
                            if (!first) {
                                number == 1?renderacctTreeLayerTable(number,obj.curr,obj.limit):renderacctTreeLayerTable(number,-1,-1);
                            }
                        }
                    });
                }
            }
        })
    }


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(rolemanagerTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id
            $('#editRoleForm').find('input[name=\'id\']').val(id)
            var index = layer.open({
                type: 1,
                title: '编辑角色',
                // shade: 0, //遮罩透明度
                shadeClose: false,
                move: false,
                area: ['800px', '350px'],
                content: $('#editRoleLayer'),
                success: function(layero) {
                    var mask = $('.layui-layer-shade')
                    mask.appendTo(layero.parent())
                },
                end: function() {
                    // $("#editRoleForm")[0].reset();
                    $('#editRoleForm').trigger('reset')
                },
                btn: ['确定', '取消'],
                yes: lms_debounce(function(index, layero) {
                    $('#submitEditBtn').click()
                }, 1000)
            })
            $.ajax({
                type: 'post',
                url: ctx + '/sys/getRoleById.html',
                data: { 'id': id },
                dataType: 'json',
                async: false,
                success: function(returnData) {
                    if (returnData.code == '0000') {
                        var obj = returnData.data
                        $('#editRoleForm').find('input[name=\'name\']').val(obj.name)
                        $('#editRoleForm').find('textarea[name=\'remark\']').val(obj.remark)
                        $('#editRoleForm').find('input[name=\'sort\']').val(obj.sort)
                    } else {
                        layer.msg(returnData.msg)
                    }
                }
            })
        } else if (layEvent === 'del') {
            deleteRole(data.id)
        } else if (layEvent === 'open') {
            openRole(data.id)
        } else if (layEvent == 'authResource') {
            layer.open({
                type: 1,
                title: '授予资源',
                area: ['580px', '650px'],
                // shade: 0, //遮罩透明度
                shadeClose: false,
                content: $('#roleResourceTreeLayer').html(),
                success: function() {
                    var tarXTree = $('#roleResourceForm #roleResourceXTree').eq(1)
                    tarXTree.attr('id', 'roleResourceXTree1')
                    roleResourceXTree1 = tarXTree.attr('id')
                    roleResourceXTree = new layuiXtree({
                        elem: roleResourceXTree1, //(必填) 放置xtree的容器id，不要带#号,
                        form: form, //(必填) layui 的 from,
                        isopen: true, //加载完毕后的展开状态，默认值：true,
                        //data: ctx+"/sys/listAllResource.html", //(必填) json数组
                        data: [],
                        ckall: true, //启用全选功能，默认值：false
                        ckallback: function(data) { //全选框状态改变后执行的回调函数
                        },
                        color: { //三种图标颜色，独立配色，更改几个都可以
                            open: '#EE9A00', //节点图标打开的颜色
                            close: '#EEC591', //节点图标关闭的颜色
                            end: '#828282', //末级节点图标的颜色
                        },
                        click: function(data) { //节点选中状态改变事件监听，全选框有自己的监听事件
                        }
                    })
                    roleResourceXTree.renderByData(ctx + '/sys/listAllResourceByRoleOrUser.html?roleId=' + data.id)
                },
                btn: ['确认', '取消'],
                yes: lms_debounce(function() {
                    //授予资源
                    var id = $('#roleResourceForm').eq(1).find('input[name=\'id\']').val()
                    var resourcArr = new Array()
                    var checkedArr = roleResourceXTree.GetAllChecked()
                    for (var i in checkedArr) {
                        resourcArr.push(checkedArr[i].value)
                    }
                    $.ajax({
                        type: 'post',
                        url: ctx + '/sys/authResourceForRole.html',
                        async: false,
                        data: { 'roleId': id, 'resourceIds': resourcArr.join(',') },
                        dataType: 'json',
                        beforeSend: function () {
                             loading.show()
                        },
                        success: function(returnData) {
                            loading.hide()
                            if (returnData.code == '0000') {
                                layer.closeAll()
                                layer.msg('授予资源成功')
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('发送请求失败')
                        }
                    })
                }, 1000),
            })
            $('#roleResourceForm').eq(1).find('input[name=\'id\']').val(data.id)
        } else if (layEvent == 'authAcct') {
            layer.open({
                type: 1,
                title: '授予店铺',
                area: ['1000px', '650px'],
                // shade: 0, //遮罩透明度
                shadeClose: false,
                content: $('#roleAcctTreeLayer').html(),
                success: function() {
                    increaseStoreAcct = [];
                    decreaseStoreAcct = [];
                    currentPageAllData = 1;
                    limitAllData = 100;
                    let userId = data.id;

                    $("#role_input_userid").val(userId);
                    formSelects.render('role_searchCondition1_platcode')
                    formSelects.render('role_searchCondition2_platcode')
                    // 表格
                    allstatusOrderPage(1)
                    // allstatusOrderPage(2)
                    // // 分页
                    renderacctTreeLayerTable(1,1,100);
                    renderacctTreeLayerTable(2,-1,-1);

                    //展示平台列表
                    $.ajax({
                        type: "post",
                        url: ctx + "/sysuser/getAuthPlatListByUserOrRole.html",
                        data: { "roleId":data.id },
                        dataType: "json",
                        async: false,
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                var result = returnData.data;
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].checkedFlag) {
                                        $('#rolePlatAuthAddForm').append(`<input name="authPlat" type="checkbox" value="` + result[i].name + `" title="`+result[i].name+`" checked lay-skin="primary">`);

                                    } else {
                                        $('#rolePlatAuthAddForm').append(`<input name="authPlat" type="checkbox" value="` + result[i].name + `" title="`+result[i].name+`"  lay-skin="primary">`);
                                    }
                                }
                                form.render();
                            }else{
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layer.msg("发送请求失败");
                        }
                    });

                    // 获取平台
                    commonReturnPromise({
                        url: '/lms/unauditorder/listenum.html'
                    }).then(res=>{
                        const arr = res.platCodes.map(v=>({value:v,name:v}))
                        formSelects.data('role_searchCondition1_platcode','local',{arr})
                        formSelects.data('role_searchCondition2_platcode','local',{arr})
                    })



                    // var tarXTree = $('#roleAcctForm #roleAcctXTree')
                    // tarXTree.attr('id', 'roleAcctXTree1')
                    // roleAcctXTree1 = tarXTree.attr('id')
                    // roleAcctXTree = new layuiXtree({
                    //     elem: roleAcctXTree1, //(必填) 放置xtree的容器id，不要带#号,
                    //     form: form, //(必填) layui 的 from,
                    //     isopen: true, //加载完毕后的展开状态，默认值：true,
                    //     isParentChangeCheck: false,
                    //     //data: ctx+"/sys/listAllPlatAccTree.html", //(必填) json数组
                    //     data: [],
                    //     ckall: true, //启用全选功能，默认值：false
                    //     ckallback: function(data) { //全选框状态改变后执行的回调函数
                    //     },
                    //     color: { //三种图标颜色，独立配色，更改几个都可以
                    //         open: '#EE9A00', //节点图标打开的颜色
                    //         close: '#EEC591', //节点图标关闭的颜色
                    //         end: '#828282', //末级节点图标的颜色
                    //     },
                    //     click: function(data) { //节点选中状态改变事件监听，全选框有自己的监听事件
                    //     }
                    // })
                    // roleAcctXTree.renderByData(ctx + '/sys/listAllPlatAccByRoleOrUser.html?roleId=' + data.id)
                },
                btn: ['确认', '取消'],
                yes: lms_debounce(function() {
                    // //授予账号
                    // var id = $("#roleAcctForm input[name=id]").val();
                    // var acctArr = new Array()
                    // var checkedArr = roleAcctXTree.GetChecked()
                    // for (var i in checkedArr) {
                    //     acctArr.push(checkedArr[i].value)
                    // }
                    // //获取全选的平台
                    // var array = $('#rolePlatAuthAddForm input[name=authPlat]');
                    // var autoAuthArray = new Array()
                    // for (var i=0;i<array.length;i++) {
                    //     console.log(i);   if($(array[i]).prop('checked')) {
                    //         autoAuthArray.push($(array[i]).val());
                    //     }
                    // };
                    // var autoAuthPlat = autoAuthArray.join(',')
                    //
                    // $.ajax({
                    //     type: 'post',
                    //     url: ctx + '/sys/authAcctForRole.html',
                    //     async: false,
                    //     data: { 'id': id, 'acctIds': acctArr.join(','), 'authPlatList': autoAuthPlat },
                    //     dataType: 'json',
                    //     success: function(returnData) {
                    //         if (returnData.code == '0000') {
                    //             layer.closeAll()
                    //             layer.msg('授予店铺成功')
                    //         } else {
                    //             layer.msg(returnData.msg)
                    //         }
                    //     },
                    //     error: function() {
                    //         layer.msg('发送请求失败')
                    //     }
                    // })
                    // 新增授权和移除授权的数据
                    let increaseStoreAcctIds = increaseStoreAcct.map(item => item.id)
                    let decreaseStoreAcctIds = decreaseStoreAcct.map(item => item.id)

                    //获取全选的平台
                    var array = $('#rolePlatAuthAddForm input[name=authPlat]');
                    var autoAuthArray = new Array();
                    for(var i = 0; i < array.length; i++) {
                        if($(array[i]).prop('checked')) {
                            autoAuthArray.push($(array[i]).val());
                        }
                    };
                    // var autoAuthPlat = autoAuthArray.join(",");

                    let obj = {
                        "roleId": data.id,
                        "increaseStoreAcctIds": increaseStoreAcctIds,
                        "decreaseStoreAcctIds":decreaseStoreAcctIds,
                        "platCodes": autoAuthArray
                    }
                    commonReturnPromise({
                        url: ctx + '/sysuser/v2/AcctAuth.html',
                        type: 'put',
                        params: JSON.stringify(obj),
                        dataType: "json",
                        contentType: 'application/json'
                    }).then(function(result){
                        layer.closeAll();
                        layer.msg("授予店铺成功");
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }, 1000),
            })
            $("#roleAcctForm input[name=id]").val(data.id)
        }else if(layEvent == 'authTimetask'){
          role_authTimetaskHandle(data);
        }
        if (layEvent === 'editSort') {
            var index = layer.open({
                type: 1,
                title: '设置排序号',
                // shade: 0, //遮罩透明度
                shadeClose: false,
                area: ['260px', '180px'],
                content: $('#sysRoleInsertSortLayer').html(),
                end: function() {
                },
                btn: ['确定', '取消'],
                success:function(){
                    $("#sysRoleInsertSort_FORM input[name=newSort]").val(data.sort);
                },
                yes: lms_debounce(function(index, layero) {
                    var req={};
                    req.id=data.id;
                    req.opType=layEvent;
                    req.newSort=$("#sysRoleInsertSort_FORM input[name=newSort]").val();
                    ajaxSortSysRole(req);
                }, 1000)

            })
        } else if(layEvent == "authWarehouseForRole") {
            authWarehouseForRoleOpen(data)
        }
    })

     //授予报表操作
  function role_authTimetaskHandle(data){
    let id = data.id;
    commonTasktimeAndDict_showSelectedItemAjax(id, 'TIMING_REPORT', 2).then(ckedRes => {
      //选中的数据ckedRes
      let ckedIdsList = ckedRes.map(item=> Number(item.resourceVal));
      layer.open({
        type: 1,
        title: '授予报表--'+ data.name,
        btn: ['授权', '关闭'],
        area: ['60%', '80%'],
        content: $('#role_authTimetaskLayer').html(),
        id: 'role_authTimetaskLayerId',
        success: function(){
          table.render({
            elem: '#role_authTimetaskLayer_table'
            ,id: 'role_authTimetaskLayer_tableId'
            ,height: 500
            ,url: '/lms/statisticReport/pageQuery' //数据接口
            ,page: false //开启分页
            ,limit: 10000
            ,created(res){
              if(ckedIdsList.length == 0){
                return res;
              }else{
                for(let i=0; i<res.data.length; i++){
                  let item = res.data[i];
                  if(ckedIdsList.includes(item.id)){
                    item.LAY_CHECKED = true;
                  }
                }
                return res;
              }
            }
            ,cols: [[ //表头
              {type: 'checkbox', width: 40}
              ,{ title: "状态",field: "status", templet: '#role_timetask_status',}
              ,{field: 'name', title: '报表名称'}
              ,{title: "定时发送日期",field: "sendDays",templet: '#role_timetask_sendDays'}
              ,{title: "定时发送时间",field: "sendTime",
                templet: d => {
                    let exportMinute = ""
                    if (d.exportHour !== null && d.exportHour !== undefined) {
                        exportHour = d.exportHour
                        if (d.exportHour < 10) {
                            exportHour = `0${d.exportHour}`
                        }
                    }
                    if (d.exportMinute !== null && d.exportMinute !== undefined) {
                        exportMinute = d.exportMinute
                        if (d.exportMinute < 10) {
                            exportMinute = `0${d.exportMinute}`
                        }
                    }
                    return `${exportHour}:${exportMinute}`
                }
              }
              ,{title: "收件人",field: "recipientIds",templet: '#role_timetask_recipientIds'}
              ,{title: '备注',
              field: 'remark',
              templet: d => {
                  let strHtml = ''
                  if(d.remark!==null && d.remark!==undefined){
                      return `<div class="timetask_overflow_four" lay-tips="${d.remark}">${d.remark}</div>`
                  }
                  return strHtml
              }}
              ,{field: 'configType', title: '分类'}
            ]]
          });
        },
        yes: function(index){
          let ckedData = table.checkStatus('role_authTimetaskLayer_tableId');
          let idsList = ckedData.data.map(item => item.id);
  
          commonTasktimeAndDict_singleAddPermissionAjax(id, idsList.join(','), 'TIMING_REPORT', 2).then(res => {
            layer.msg(res || '操作成功', {icon: 1});
            layer.close(index);
          });
        }
      });
    });
  }


    //修改
    form.on('submit(editBtn)', function(data) {
        $.ajax({
            type: 'post',
            url: ctx + '/sys/editRole.html',
            dataType: 'json',
            data: data.field,
            success: function(returnData) {
                if (returnData.code == '0000') {
                    layer.closeAll()
                    active['reload'].call()
                    layer.msg('修改角色成功')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                layer.msg('发送请求失败')
            }
        })
        return false
    })


    //停用
    function deleteRole(roleId) {
        layer.confirm('停用后拥有此角色的用户不再拥有此角色的权限，是否确认停用？', function(result) {
            if (result) {
                $.ajax({
                    type: 'post',
                    url: ctx + '/sys/delOrOpenRole.html',
                    data: { 'roleId': roleId, 'status': false },
                    dataType: 'json',
                    success: function(returnData) {
                        if (returnData.code == '0000') {
                            active['reload'].call()
                            layer.msg('停用成功')
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            }
        })
    }

    //启用
    function openRole(roleId) {
        $.ajax({
            type: 'post',
            url: ctx + '/sys/delOrOpenRole.html',
            data: { 'roleId': roleId, 'status': true },
            dataType: 'json',
            success: function(returnData) {
                if (returnData.code == '0000') {
                    active['reload'].call()
                    layer.msg('启用成功')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                layer.msg('发送请求失败')
            }
        })
    }

    //授权仓库给用户
    function authWarehouseForRoleOpen(data) {
        var roleId = data.id;
        //加载仓库列表
        $.ajax({
            type: "post",
            url: ctx + "/prodWarehouse/getWarehouseByAuth",
            dataType: "json",
            success: function(returnData) {
                if(returnData.code == "0000") {
                    laytpl($("#role_authWarehouseTpl").html()).render(returnData.data, function(html) {
                        layer.open({
                            title: "授予仓库",
                            content: html,
                            area: ['50%', '50%'],
                            btn: ['确认', '取消'],
                            success: function(layero, index) {
                                layui.form.render('checkbox');
                            },
                            yes: lms_debounce(function(index, layero) {
                                var prodWarehouseIds = [];
                                $("#role_authWarehouseForm input[name=prodWarehouse]:checked").each(function() {
                                    prodWarehouseIds.push($(this).val());
                                });
                                layui.admin.load.show();
                                $.ajax({
                                    type: "post",
                                    url: ctx + "/sys/authWarehouseForRole.html",
                                    dataType: "json",
                                    data: {
                                        roleId: roleId,
                                        prodWarehouseIds: prodWarehouseIds.join(",")
                                    },
                                    success: function(returnData) {
                                        layui.admin.load.hide();
                                        if(returnData.code == "0000") {
                                            layer.msg("仓库授权成功", {
                                                icon: 1
                                            });
                                            layer.close(index);
                                        } else {
                                            layer.msg(returnData.msg, {
                                                icon: 2
                                            });
                                        }
                                    },
                                    error: function() {
                                        layer.msg("服务器异常，请联系管理员");
                                    }
                                });
                                layer.close(index);
                            }, 1000)
                        });
                    });
                    //加载用户授权仓库
                    $.ajax({
                        type: "post",
                        url: ctx + "/sys/listAuthWarehouseByRole.html",
                        dataType: "json",
                        data: {
                            roleId: roleId
                        },
                        success: function(returnData) {
                            layui.admin.load.hide();
                            if(returnData.code == "0000") {
                                if(returnData.data && returnData.data.length > 0) {
                                    returnData.data.forEach(function(prodWarehouseId) {
                                        $("#role_authWarehouseForm input[value=" + prodWarehouseId + "]").prop("checked", true);
                                    });
                                    //判断是否全选
                                    var allChecked = $("#role_authWarehouseForm input[name=prodWarehouse]").not("input:checked").length == 0;
                                    $("#role_authWarehouseForm input[name=checkAll]").prop("checked", allChecked);
                                    form.render("checkbox");
                                }
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layui.admin.load.hide();
                            layer.msg("服务器异常，请联系管理员");
                        }
                    });
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器异常，请联系管理员");
            }
        });
    }
    //仓库与全部仓库全选
    form.on('checkbox(role_checkProdhouseAll)', function(data) {
        $(data.elem).parent("div").find("input[name=prodWarehouse]").prop("checked", data.elem.checked);
        form.render();
    });
    form.on('checkbox(role_checkProdhouseOne)', function(data) {
        var allChecked = $(data.elem).parent("div").find("input[name=prodWarehouse]").not("input:checked").length == 0;
        $(data.elem).parent("div").find("input[name=checkAll]").prop("checked", allChecked);
        form.render();
    });

})