layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        form = layui.form;
    laydate.render({
        elem: '#statisticpack_timeStr',
        type: 'date',
        range: true
    });

    // 初始化设置日期为当前1个月内时间
    var date = new Date()
    date.setDate(date.getDate());
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#statisticpack_timeStr').val(timeStr)

    function statisticpack_showMainTable(data) {
        table.render({
            elem: '#statisticpack_table',
            data: data,
            page: false,
            id: "statisticpack_table",
            width: 800,
            limit: data ? data.length : 20,
            cols: [
                [
                    {title: '装箱人员', templet:'<div><div class="canClickEl" lay-event="showEveryDay">{{d.creator}}</div></div>'},
                    {title: '箱数', field:'caseNum'},
                    {title: '子包裹数', field:'skuNum'},
                    {title: '重量(kg)', field:'totalWeight'},
                ]
            ]
        });
    }

    $('#statisticpack_searchBtn').click(function () {
        let times = $('#statisticpack_timeStr').val()
        if (!times) {
            layer.msg('请选择统计时间区间')
            return
        }
        let arr = times.split(' - ')
        let data = {
            beginTime: arr[0],
            endTime: arr[1],
        }

        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/winitStatistic/statisticPack.html',
            data: JSON.stringify(data),
            success:function (res) {
                if (res.code === '0000') {
                    statisticpack_showMainTable(res.data)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    })

    table.on('tool(statisticpack_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'showEveryDay') {
            statisticpack_showEveryDay(data)
        }
    })

    function statisticpack_showEveryDay(statisticInfo) {
        layer.open({
            title: '每日包装统计',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['850px', '80%'],
            btn: ['关闭'],
            content: $('#statisticpack_personEveryDayPop').html(),
            success: function () {
                let data = {
                    beginTime: statisticInfo.beginTime,
                    endTime: statisticInfo.endTime,
                    creatorId: statisticInfo.creator_id
                }
                let ajax = new Ajax(false)
                ajax.post({
                    url: ctx + '/winitStatistic/statisticPackForEveryDay.html',
                    data: JSON.stringify(data),
                    success: function (res) {
                        if (res.code === '0000') {
                            table.render({
                                elem: '#statisticpack_personEveryDayTable',
                                data: res.data,
                                page: false,
                                id: "statisticpack_personEveryDayTableId",
                                width: 800,
                                limit: res.data ? res.data.length : 20,
                                cols: [
                                    [
                                        {title: '装箱人员', field: 'creator'},
                                        {title: '装箱日期', field: 'packDate'},
                                        {title: '箱数', field:'caseNum'},
                                        {title: '子包裹数', field:'skuNum'},
                                        {title: '重量(kg)', field:'totalWeight'},
                                    ]
                                ],
                                done: function(){

                                }
                            });
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    }
    
    $('#statisticpack_export').click(function () {
        let timeStr = $('#statisticpack_timeStr').val()
        let timeArr = timeStr.split(' - ')
        let data = {
            beginTime: timeArr[0],
            endTime: timeArr[1],
        }
        submitForm(data, ctx + '/winitStatistic/exportStatisticPackForEveryDay.html',"_blank")
    })
})
