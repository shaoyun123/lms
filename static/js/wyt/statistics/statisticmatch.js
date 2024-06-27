layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        form = layui.form;
    laydate.render({
        elem: '#statisticmatch_timeStr',
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
    $('#statisticmatch_timeStr').val(timeStr)


    function statisticmatch_showMainTable(data) {
        table.render({
            elem: '#statisticmatch_table',
            data: data,
            page: false,
            id: "statisticmatch_table",
            width: 800,
            limit: data ? data.length : 20,
            cols: [
                [
                    {title: '包装人员', templet:'<div><div class="canClickEl" lay-event="showEveryDay">{{d.matcher}}</div></div>'},
                    {title: '单品SKU个数', field:'singleSkuNum'},
                    {title: '单品包装数量', field:'singleMatchAmount'},
                    {title: '多品SKU个数', field:'multipleSkuNum'},
                    {title: '多品包装数量', field:'multipleMatchAmount'},
                    {title: '分配单数量', field:'deliverNum'},
                ]
            ]
        });
    }

    $('#statisticmatch_searchBtn').click(function () {
        let times = $('#statisticmatch_timeStr').val()
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
            url: ctx + '/winitStatistic/statisticMatch.html',
            data: JSON.stringify(data),
            success:function (res) {
                if (res.code === '0000') {
                    statisticmatch_showMainTable(res.data)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    })

    table.on('tool(statisticmatch_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'showEveryDay') {
            statisticmatch_showEveryDay(data)
        }
    })

    function statisticmatch_showEveryDay(statisticInfo) {
        layer.open({
            title: '每日包装统计',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['850px', '80%'],
            btn: ['关闭'],
            content: $('#statisticmatch_personEveryDayPop').html(),
            success: function () {
                let data = {
                    beginTime: statisticInfo.beginTime,
                    endTime: statisticInfo.endTime,
                    matcherId: statisticInfo.matcher_id
                }
                let ajax = new Ajax(false)
                ajax.post({
                    url: ctx + '/winitStatistic/statisticMatchForEveryDay.html',
                    data: JSON.stringify(data),
                    success: function (res) {
                        if (res.code === '0000') {
                            table.render({
                                elem: '#statisticmatch_personEveryDayTable',
                                data: res.data,
                                page: false,
                                id: "statisticmatch_personEveryDayTableId",
                                width: 800,
                                limit: res.data ? res.data.length : 20,
                                cols: [
                                    [
                                        {title: '包装人员', field: 'matcher'},
                                        {title: '包装日期', field: 'matchDate'},
                                        {title: '单品SKU个数', field:'singleSkuNum'},
                                        {title: '单品包装数量', field:'singleMatchAmount'},
                                        {title: '多品SKU个数', field:'multipleSkuNum'},
                                        {title: '多品包装数量', field:'multipleMatchAmount'},
                                        {title: '分配单数量', field:'deliverNum'},
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
    
    $('#statisticmatch_exportBtn').click(function () {
        let timeStr = $('#statisticmatch_timeStr').val()
        let timeArr = timeStr.split(' - ')
        let data = {
            beginTime: timeArr[0],
            endTime: timeArr[1],
        }
        submitForm(data, ctx + '/winitStatistic/exportStatisticMatchForEveryDay.html',"_blank")
    })
})
