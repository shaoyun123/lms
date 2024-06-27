layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element", 'upload', "formSelects"], function() {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        $ = layui.$,
        laydate = layui.laydate;

    laydate.render({
        elem: '#thirtySales_lastTradeTime'
    })
    // 默认当前时间
    var now = new Date()
    $('#thirtySales_lastTradeTime').val(Format(now,'yyyy-MM-dd'))
    form.render('select')

    initHpSelect('#thirtySales_searchForm')

    function thirty_search(data,dateList) {
        table.render({
            elem: "#thirtysales_table",
            method: 'post',
            url: ctx + "/salesStatistics/getThirtyDaysSales.html",
            where: data,
            unFixedTableHead: true, 
            height: 'full-250',
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { title: "子sku", width: 150 , templet: "<div>{{d.prodSInfo.sSku}}</div>"},
                    { title: "采购员", width: 100 , templet: "<div>{{d.prodSInfo.buyer || ''}}</div>"},
                    { title: "开发时间", width: 100 , templet: "<div>{{Format(d.prodSInfo.createTime, 'yyyy-MM-dd')}}</div>"},
                    { title: `往前1天<br><font color='#1e95ff'>(${dateList[0]})</font>`, width:60,templet: "<div>{{ d.dailySalesList[0].totalSalesNum || 0}}</div>"},
                    { title: `往前2天<br><font color='#1e95ff'>(${dateList[1]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[1].totalSalesNum || 0}}</div>"},
                    { title: `往前3天<br><font color='#1e95ff'>(${dateList[2]})</font>`, width:60,templet: "<div>{{ d.dailySalesList[2].totalSalesNum || 0}}</div>"},
                    { title: `往前4天<br><font color='#1e95ff'>(${dateList[3]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[3].totalSalesNum || 0}}</div>"},
                    { title: `往前5天<br><font color='#1e95ff'>(${dateList[4]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[4].totalSalesNum || 0}}</div>"},
                    { title: `往前6天<br><font color='#1e95ff'>(${dateList[5]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[5].totalSalesNum || 0}}</div>"},
                    { title: `往前7天<br><font color='#1e95ff'>(${dateList[6]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[6].totalSalesNum || 0}}</div>"},
                    { title: `往前8天<br><font color='#1e95ff'>(${dateList[7]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[7].totalSalesNum || 0}}</div>"},
                    { title: `往前9天<br><font color='#1e95ff'>(${dateList[8]})</font>`, width:60, templet: "<div>{{ d.dailySalesList[8].totalSalesNum || 0}}</div>"},
                    { title: `往前10天<br><font color='#1e95ff'>(${dateList[9]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[9].totalSalesNum || 0}}</div>"},
                    { title: `往前11天<br><font color='#1e95ff'>(${dateList[10]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[10].totalSalesNum || 0}}</div>"},
                    { title: `往前12天<br><font color='#1e95ff'>(${dateList[11]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[11].totalSalesNum || 0}}</div>"},
                    { title: `往前13天<br><font color='#1e95ff'>(${dateList[12]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[12].totalSalesNum || 0}}</div>"},
                    { title: `往前14天<br><font color='#1e95ff'>(${dateList[13]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[13].totalSalesNum || 0}}</div>"},
                    { title: `往前15天<br><font color='#1e95ff'>(${dateList[14]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[14].totalSalesNum || 0}}</div>"},
                    { title: `往前16天<br><font color='#1e95ff'>(${dateList[15]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[15].totalSalesNum || 0}}</div>"},
                    { title: `往前17天<br><font color='#1e95ff'>(${dateList[16]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[16].totalSalesNum || 0}}</div>"},
                    { title: `往前18天<br><font color='#1e95ff'>(${dateList[17]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[17].totalSalesNum || 0}}</div>"},
                    { title: `往前19天<br><font color='#1e95ff'>(${dateList[18]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[18].totalSalesNum || 0}}</div>"},
                    { title: `往前20天<br><font color='#1e95ff'>(${dateList[19]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[19].totalSalesNum || 0}}</div>"},
                    { title: `往前21天<br><font color='#1e95ff'>(${dateList[20]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[20].totalSalesNum || 0}}</div>"},
                    { title: `往前22天<br><font color='#1e95ff'>(${dateList[21]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[21].totalSalesNum || 0}}</div>"},
                    { title: `往前23天<br><font color='#1e95ff'>(${dateList[22]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[22].totalSalesNum || 0}}</div>"},
                    { title: `往前24天<br><font color='#1e95ff'>(${dateList[23]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[23].totalSalesNum || 0}}</div>"},
                    { title: `往前25天<br><font color='#1e95ff'>(${dateList[24]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[24].totalSalesNum || 0}}</div>"},
                    { title: `往前26天<br><font color='#1e95ff'>(${dateList[25]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[25].totalSalesNum || 0}}</div>"},
                    { title: `往前27天<br><font color='#1e95ff'>(${dateList[26]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[26].totalSalesNum || 0}}</div>"},
                    { title: `往前28天<br><font color='#1e95ff'>(${dateList[27]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[27].totalSalesNum || 0}}</div>"},
                    { title: `往前29天<br><font color='#1e95ff'>(${dateList[28]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[28].totalSalesNum || 0}}</div>"},
                    { title: `往前30天<br><font color='#1e95ff'>(${dateList[29]})</font>`, width:77, templet: "<div>{{ d.dailySalesList[29].totalSalesNum || 0}}</div>"},
                ],
            ],
            id: "thirtysales_table",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function(res, curr, count) {
                $("#thirtysales_countNum").html(count);
                //懒加载
                imageLazyload();
            }
        });
    }

    $('#thirtysales_searchBtn').click(function () {
        let data = serializeObject($("#thirtySales_searchForm"));
        if(!data.lastTradeTime){
          return layer.msg('请选择最后交易时间', {icon:7});
        }
        let dateList = []; //30天日期
        let currDate = new Date(data.lastTradeTime).getTime();
        for(let i=1; i<31;i++){
          let iTime = currDate - 24*60*60*1000*i;
          let iDate = Format(iTime, 'MM-dd');
          dateList.push(iDate)
        }
        // console.log(dateList);
        thirty_search(data, dateList);
    })

    $('#thirtysales_export').click(function () {
        var data = {}
        var searchParam = serializeObject($('#thirtySales_searchForm'))
        checkNull(searchParam)
        data.searchParam = JSON.stringify(searchParam)
        var Confirmindex = layer.confirm('确认导出该查询条件下的30天销量报表吗？', {btn: ['确认', '取消']}, function () {
            layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
            submitForm(data, ctx + '/salesStatistics/export.html')
            layer.close(outerIndex);
        })
    })
})