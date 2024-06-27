/**
 * 待办事项列表js
 */
var getTodoList
layui.use(['admin', 'table', 'util','form'], function () {
    var $ = layui.$,
        admin = layui.admin,
        form = layui.form,
        table = layui.table;
    form.render('select','msgTodoListSearchForm')
    /**
     * 统计个人所有待办
     */
    function todo_countAllList(data){
        $.ajax({
            url: ctx + "/msgtodolist/countAllTodoList.html",
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: "json",
            success: function (res) {
                if (res.code == "0000") {
                    console.log(res)
                    var json = {}
                    var list = res.data
                    for(var i = 0; i < list.length; ++i) {
                        json[list[i].todoType] = list[i]
                    }
                    var typeLis = $('#todo_list_ul_tab li')
                    for (var i = 0; i < typeLis.length; ++i) {
                        var type = typeLis[i].getAttribute('type')
                        $(typeLis[i]).find('.layui-badge').text("0")
                        if (json[type]) {
                            $(typeLis[i]).find('.layui-badge').text(json[type].todoNum)
                        }
                    }

                } else {
                    layer.msg(res.msg);
                }
            },
        });
    };

    function renderTable_msgTodoList(data) {
        table.render({
            elem: "#todo_list_data_table",
            method: "post",
            url: ctx + "/msgtodolist/getAllTodoList.html",
            cols: [
                [{
                    type: 'checkbox',
                    fixed: 'left'
                }, {
                    title: '标题内容',
                    minWidth: 300,
                    templet: '<div><span class="{{!d.status ? `fGrey` : ``}}">{{d.listTitle}}</span></div>'
                }, {
                    field: 'time',
                    title: '时间',
                    width: 170,
                    templet: '<div>{{ layui.util.timeAgo(d.createTime) }}</div>'
                }]
            ],
            where:data,
            id: 'todo_list_data_table',
            page: true,
            limits: [50, 100],
            limit: 50
        });
    }

    /**
     * 获取待办列表
     * @param listType
     */
    getTodoList = function(listType){
        $('#msgTodoListSearchForm [name=listType]').val(listType)
        var data = serializeObject($('#msgTodoListSearchForm'))
        todo_countAllList(data);
        renderTable_msgTodoList(data)
    };


    // 初始化查询
    getTodoList("");

    /**
     * 批量处理
     */
    $("#todo_list_batch_deal_btn").click(function() {
        var itemData = table.checkStatus('todo_list_data_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择要处理待办事项", {icon: 0});
            return;
        }
        var list = [];
        for (var index in itemData) {
            var obj = itemData[index];
            if (!obj.status) {
                layer.msg('请选择尚未处理的事项')
                return
            }
            list.push({
                id: obj.id,
                listType: obj.listType,
                listId: obj.listId,
            });
        }
        $.ajax({
            url: ctx + "/msgtodolist/dealTodoList.html",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify(list),
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.msg('处理成功');
                    getTodoList(todoType)
                } else {
                    layer.msg(returnData.msg);
                }
            },
        });
    });

    form.on('select(status_msgTodoListSearchForm)',function () {
        var data = serializeObject($('#msgTodoListSearchForm'))
        todo_countAllList(data);
        renderTable_msgTodoList(data)
    })
});
