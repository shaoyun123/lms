layui.use(["admin", "form", "table", "layer", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    function search_logistTypeCollection(data) {
        table.render({
            elem: "#logistTypeCollectionTable",
            id: 'logistTypeCollectionTable',
            method: "post",
            url: ctx + "/logistTypeCollection/queryPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {field: "collectionName", title: "集合名称",width: 200},
                    {title: "物流方式",templet: "#logistTypeLiBox_logistTypeCollection"},
                    {field: "remark", title: "备注",width: 250},
                    {title: '操作', align: 'center', toolbar: '#Bar_logistTypeCollection',width: 150}
                ],
            ],
            done: function(res, curr, count){
                $("#logistTypeCollection_colLen").text(res.count);
                // 表头固定
                theadHandle().fixTh({ id:'#logistTypeCollectionmanageCard',h:200 })
            },
            page: true, //是否显示分页
            limits: [100, 500, 1000],
            limit: 1000, //每页默认显示的数量
        });
    }
    // 数据初始化
    search_logistTypeCollection({status: 1});

    table.on('edit(logistTypeCollectionTable)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段

        var Adata = {id: data.id}
        Adata[field] = value
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/msgCalPriceFormula/updateFiled.html",
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {
                if (data.code == '0000') {
                    layer.msg('修改成功')
                }
            }
        })
    })


    // 搜索
    $('#searchBtn_logistTypeCollection').click(function () {
      var data = {
        platCode: $('#logistTypeCollectionSearchForm [name=platCode]').val(),
        status: $('#logistTypeCollectionSearchForm [name=status]').val(),
      }
      var  collectionName = $('#logistTypeCollectionSearchForm [name=collectionName]').val()
        if (collectionName!=='' && collectionName !== undefined){
          data.collectionName = collectionName
        }
        search_logistTypeCollection(data)
    });

    // 新增
    $('#addBtn_logistTypeCollectionBtn').click(function () {
        var popIndex = layer.open({
            shadeClose: false,
            type: 1,
            title: "新增物流方式集",
            area: ["85%", "80%"],
            btn: ['新增', '关闭'],
            content: $("#logistTypeCollectionAddLayer").html(),
            success: function () {
                initNotNull('#logistTypeCollectionAddForm')
                init_logistTypeCollectionAddLayer()
            },
            yes: function () {
                if (!checkNotNull('#logistTypeCollectionAddForm')){
                    return
                }

                var data = {
                    collectionName: $('#logistTypeCollectionAddForm [name=collectionName]').val(),
                    sort: $('#logistTypeCollectionAddForm [name=sort]').val(),
                    remark: $('#logistTypeCollectionAddForm [name=remark]').val()
                }
                var detailList =[]
                var checkedList = $('#logistTypeBox_logisTypeCollectionAddForm input:checked')
                for (var i = 0; i < checkedList.length; ++i) {
                    detailList.push({logistTypeId: checkedList[i].value})
                }
                console.log(detailList)
                data.detailList = detailList
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/logistTypeCollection/addOrUpdateOne.html",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.close(popIndex)
                            $('#searchBtn_logistTypeCollection').click()
                        }
                    }
                })
            }
        })
    })



    function init_logistTypeCollectionAddLayer(checkList) {
        $.ajax({
            url: ctx + "/logistTypeCollection/getAllLogisType.html",
            method: 'post',
            dataType: 'json',
            success: function (res) {
                console.log(1111)
                if (res.code == '0000') {
                    var list = res.data
                    var html = ''
                    for (var i = 0; i < list.length; ++i) {
                        html += '<div class="fieldBox_logistTypeCollection"><input type="checkbox" title="'+ list[i].name +'" lay-skin="primary" value="'+ list[i].id +'"></div>'
                    }
                    $('#logistTypeBox_logisTypeCollectionAddForm').html(html)

                    if(checkList && Array.isArray(checkList)){
                        for (var i = 0; i < checkList.length; ++i) {
                            $('#logistTypeBox_logisTypeCollectionAddForm [value='+ checkList[i].logistTypeId +']').prop('checked', true)
                        }
                    }

                    form.render('checkbox','logistTypeCollectionAddForm')
                }
            }
        })
    }

    table.on('tool(logistTypeCollectionTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit'){
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "编辑物流方式集",
                area: ["85%", "80%"],
                btn: ['保存', '关闭'],
                content: $("#logistTypeCollectionAddLayer").html(),
                success: function () {
                    initNotNull('#logistTypeCollectionAddForm')
                    // 渲染原有数据
                    init_logistTypeCollectionAddLayer(data.detailList)
                    $('#logistTypeCollectionAddForm [name=id]').val(data.id)
                    $('#logistTypeCollectionAddForm [name=collectionName]').val(data.collectionName)
                    $('#logistTypeCollectionAddForm [name=sort]').val(data.sort)
                    $('#logistTypeCollectionAddForm [name=remark]').val(data.remark)

                },
                yes: function () {
                    if (!checkNotNull('#logistTypeCollectionAddForm')){
                        return
                    }

                    var data = {
                        id: $('#logistTypeCollectionAddForm [name=id]').val(),
                        collectionName: $('#logistTypeCollectionAddForm [name=collectionName]').val(),
                        sort: $('#logistTypeCollectionAddForm [name=sort]').val(),
                        remark: $('#logistTypeCollectionAddForm [name=remark]').val()
                    }
                    var detailList =[]
                    var checkedList = $('#logistTypeBox_logisTypeCollectionAddForm input:checked')
                    for (var i = 0; i < checkedList.length; ++i) {
                        detailList.push({logistTypeId: checkedList[i].value})
                    }
                    console.log(detailList)
                    data.detailList = detailList
                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/logistTypeCollection/addOrUpdateOne.html",
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.close(popIndex)
                                $('#searchBtn_logistTypeCollection').click()
                            }
                        }
                    })
                }
            })
        }else if(layEvent == 'status'){
          let status = data.status;
          let newStatus = status == 1 ? 0 : 1;
          let tipStr = status == 1 ? '确定要更改为停用状态?' : '确定要更改为启用状态?';
          layer.confirm(tipStr, {icon: 3, title:'提示'}, function(index){
            commonReturnPromise({
              url: '/lms/logistTypeCollection/updateStatus',
              contentType: 'application/json',
              type: 'post',
              params: JSON.stringify({
                id: data.id,
                status: newStatus
              })
            }).then(res => {
              layer.msg(res || '操作成功', {icon: 1});
              //触发搜索事件
              $("#searchBtn_logistTypeCollection").trigger('click');
            });            
          });
        }
    })

});
