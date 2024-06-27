layui.use(['admin', 'layer', 'form', 'table', 'laydate', 'element', 'selectN', 'laypage'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate,
        element = layui.element,
        selectN = layui.selectN,
        laypage = layui.laypage,
        $ = layui.$
    changetype = 1;
    
    function getCols(platCode) {
        switch (platCode){
            case 'wish':
                return [[
                    {type: "checkbox"},
                    { field: "sSku", title: "子sku", width: 130 },
                    { title: "旧参数", templet: '#prodOldOriTpl', width: 130 },
                    { title: "新参数", templet: '#prodNewOriTpl', width: 130 },
                    { field: "platCode", title: "平台", width: 130, templet: '<div>'+ platCode+ '</div>' },
                    { field: "wishOrigiPrice", title: "旧价($)", width: 100, templet: '#wishOrigiPriceTpl', sort: true },
                    { field: "wishNewPrice", title: "新价($)", width: 100, templet: '#wishNewPriceTpl', sort: true },
                    { field: "PriceDif", title: "差价($)", templet: '#wishPriceDifTpl', width: 100, sort: true },
                    { field: "PriceProp", title: "比例", templet: '#wishPricePropTpl', width: 100, sort: true },
                    { field: "createTime", title: "创建时间",templet: '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150, sort: true },
                    { field: "wishProcTime", title: "处理时间", templet: '<div>{{ Format(d.wishProcTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 150 },
                    { field: "wishRemark", title: "备注", width: 130 },
                    { field: "wishProcStatus", title: "处理状态", width: 100, templet: '#wishProcStatusBar' },
                    { title: '操作', width: 150, align: 'center', toolbar: '#priceBar' }
                ]]
            case 'joom':
                return [[
                    {type: "checkbox"},
                    { field: "sSku", title: "子sku", width: 130 },
                    { title: "旧参数", templet: '#prodOldOriTpl', width: 130 },
                    { title: "新参数", templet: '#prodNewOriTpl', width: 130 },
                    { field: "platCode", title: "平台", width: 130, templet: '<div>'+ platCode+ '</div>' },
                    { field: "createTime", title: "创建时间",templet: '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150, sort: true },
                    { title: '操作', width: 150, align: 'center', toolbar: '#priceBar' }
                ]]
            case 'shopee':
                return [[
                    {type: "checkbox"},
                    { field: "sSku", title: "子sku", width: 130 },
                    { title: "旧参数", templet: '#prodOldOriTpl', width: 130 },
                    { title: "新参数", templet: '#prodNewOriTpl', width: 130 },
                    { field: "platCode", title: "平台", width: 130, templet: '<div>'+ platCode+ '</div>' },
                    { field: "shopeeOrigiPrice", title: "旧价($)", width: 100, templet: '#shopeeOrigiPriceTpl', sort: true },
                    { field: "shopeeNewPrice", title: "新价($)", width: 100, templet: '#shopeeNewPriceTpl', sort: true },
                    { field: "PriceDif", title: "差价($)", templet: '#shopeePriceDifTpl', width: 100, sort: true },
                    { field: "PriceProp", title: "比例", templet: '#shopeePricePropTpl', width: 100, sort: true },
                    { field: "createTime", title: "创建时间",templet: '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150, sort: true },
                    { field: "shopeeProcTime", title: "处理时间", templet: '<div>{{ Format(d.shopeeProcTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 150 },
                    { field: "shopeeRemark", title: "备注", width: 130 },
                    { field: "shopeeProcStatus", title: "处理状态", width: 100, templet: '#shopeeProcStatusBar' },
                    { title: '操作', width: 150, align: 'center', toolbar: '#priceBar' }
                ]]
            case 'ebay':
                return [[
                    {type: "checkbox"},
                    { field: "sSku", title: "子sku", width: 130 },
                    { title: "旧参数", templet: '#prodOldOriTpl', width: 130 },
                    { title: "新参数", templet: '#prodNewOriTpl', width: 130 },
                    { field: "platCode", title: "平台", width: 130, templet: '<div>'+ platCode+ '</div>' },
                    { field: "ebayOrigiPrice", title: "旧价($)", width: 100, templet: '#ebayOrigiPriceTpl', sort: true },
                    { field: "ebayNewPrice", title: "新价($)", width: 100, templet: '#ebayNewPriceTpl', sort: true },
                    { field: "PriceDif", title: "差价($)", templet: '#ebayPriceDifTpl', width: 100, sort: true },
                    { field: "PriceProp", title: "比例", templet: '#ebayPricePropTpl', width: 100, sort: true },
                    { field: "createTime", title: "创建时间",templet: '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150, sort: true },
                    { field: "ebayProcTime", title: "处理时间", templet: '<div>{{ Format(d.ebayProcTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 150 },
                    { field: "ebayRemark", title: "备注", width: 130 },
                    { field: "ebayProcStatus", title: "处理状态", width: 100, templet: '#ebayProcStatusBar' },
                    { title: '操作', width: 150, align: 'center', toolbar: '#priceBar' }
                ]]
            case 'smt':
                return [[
                    {type: "checkbox"},
                    { field: "sSku", title: "子sku", width: 130 },
                    { title: "旧参数", templet: '#prodOldOriTpl', width: 130 },
                    { title: "新参数", templet: '#prodNewOriTpl', width: 130 },
                    { field: "platCode", title: "平台", width: 130, templet: '<div>'+ platCode+ '</div>' },
                    { field: "smtOrigiPrice", title: "旧价($)", width: 100, templet: '#smtOrigiPriceTpl', sort: true },
                    { field: "smtNewPrice", title: "新价($)", width: 100, templet: '#smtNewPriceTpl', sort: true },
                    { field: "PriceDif", title: "差价($)", templet: '#smtPriceDifTpl', width: 100, sort: true },
                    { field: "PriceProp", title: "比例", templet: '#smtPricePropTpl', width: 100, sort: true },
                    { field: "createTime", title: "创建时间",templet: '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150, sort: true },
                    { field: "smtProcTime", title: "处理时间", templet: '<div>{{ Format(d.smtProcTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 150 },
                    { field: "smtRemark", title: "备注", width: 130 },
                    { field: "smtProcStatus", title: "处理状态", width: 100, templet: '#smtProcStatusBar' },
                    { title: '操作', width: 150, align: 'center', toolbar: '#priceBar' }
                ]]
            case 'lazada':
                return [[
                    {type: "checkbox"},
                    { field: "sSku", title: "子sku", width: 130 },
                    { title: "旧参数", templet: '#prodOldOriTpl', width: 130 },
                    { title: "新参数", templet: '#prodNewOriTpl', width: 130 },
                    { field: "platCode", title: "平台", width: 130, templet: '<div>'+ platCode+ '</div>' },
                    { field: "lazadaOrigiPrice", title: "旧价($)", width: 100, templet: '#lazadaOrigiPriceTpl', sort: true },
                    { field: "lazadaNewPrice", title: "新价($)", width: 100, templet: '#lazadaNewPriceTpl', sort: true },
                    { field: "PriceDif", title: "差价($)", templet: '#lazadaPriceDifTpl', width: 100, sort: true },
                    { field: "PriceProp", title: "比例", templet: '#lazadaPricePropTpl', width: 100, sort: true },
                    { field: "createTime", title: "创建时间",templet: '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150, sort: true },
                    { field: "lazadaProcTime", title: "处理时间", templet: '<div>{{ Format(d.lazadaProcTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 150 },
                    { field: "lazadaRemark", title: "备注", width: 130 },
                    { field: "lazadaProcStatus", title: "处理状态", width: 100, templet: '#lazadaProcStatusBar' },
                    { title: '操作', width: 150, align: 'center', toolbar: '#priceBar' }
                ]]
        }
    }
    function dealOrderBy(data) {
        if (!data.orderBy) {
            return ''
        }
        console.log(111)
        if (data.orderBy.indexOf('PriceDif') < 0 && data.orderBy.indexOf('PriceProp') < 0 ) {
            return toLine(data.orderBy)
        }
        let str = data.orderBy
        switch (data.platCode) {
            case 'wish':
                return str.replace('PriceDif','wish_new_price - wish_origi_price').replace('PriceProp', 'wish_new_price/ wish_origi_price')
            case 'joom':
                return str.replace('PriceDif','joom_new_price - joom_origi_price').replace('PriceProp', 'joom_new_price / joom_origi_price')
            case 'ebay':
                return str.replace('PriceDif','ebay_new_price - ebay_origi_price').replace('PriceProp', 'ebay_new_price/ ebay_origi_price')
            case 'smt':
                return str.replace('PriceDif','smt_new_price - smt_origi_price').replace('PriceProp', 'smt_new_price / smt_origi_price')
            case 'shopee':
                return str.replace('PriceDif','shopee_new_price - shopee_origi_price').replace('PriceProp', 'shopee_new_price/ shopee_origi_price')
            case 'lazada':
                return str.replace('PriceDif','lazada_new_price - lazada_origi_price').replace('PriceProp', '(lazada_new_price/ lazada_origi_price')
        }
    }
    //展示已知数据
    function search(data) {
        if (!data.sSku.trim()) {
            delete data.sSku
        }
        // 排序处理
        data.orderBy = dealOrderBy(data)
        table.render({
            elem: "#intable",
            method: 'post',
            url: ctx + "/adjustPrice/prodAdjustPage.html",
            cols: getCols(data.platCode),
            page: true,
            where: data,
            id: "intable",
            limits: [100, 500, 1000],
            limit: 100,
            done: function(res, curr, count) {
                //当前分页展示的数据
                tableData = res.data;
            }
        });
    }
    //排序
    table.on('sort(intable)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"  
        //尽管我们的 table 自带排序功能，但并没有请求服务端。  
        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，如：
        let data = serializeObject($('#priceSearchForm'))
        data.orderBy = obj.field + " " + obj.type
        $('#priceSearchForm').find('[name=orderBy]').val(data.orderBy)
        search(data)
    });
    
    //日期范围
    laydate.render({
        elem: '#adjustPriceTime',
        range: true
    });
    // 备注弹框
    $('#cost_remark').click(function() {
        layer.open({
            type: 1,
            title: '备注',
            area: ['60%', '60%'],
            shadeClose: false,
            content: '<div style="padding:20px"> <textarea name="desc" placeholder="请输入内容" class="layui-textarea" style="min-height:200px"></textarea></div>',
            btn: ['关闭', '提交']
        })
    })

    form.render('select');

    $("#priceSearchBtn").click(function() {
        let data = serializeObject($('#priceSearchForm'))
        search(data)
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(intable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var id = data.id;
        if (layEvent === 'edit') {
            console.log(changetype);
            $("#checkHandleForm input[name='id']").val(id);
            $("#checkHandleForm input[name='origiCost']").val(data.wishOrigiPrice);
            $("#checkHandleForm input[name='currCost']").val(data.wishNewPrice);
            $("#checkHandleForm input[name='changetype']").val(changetype);
            $("#checkHandleForm input[name='sSku']").val(data.sSku);
            var index = layer.open({
                type: 1,
                title: "销售处理",
                shade: 0, //遮罩透明度
                area: ["800px", "600px"],
                content: $("#proHandleLayer"),
                end: function() {
                    $("#checkHandleForm")[0].reset();
                },
                btn: ['提交', '关闭'],
                yes: function(index, layero) {
                    $("#submitEbayTortDevSuggest").click();
                }
            });
        }
    });

    //提交处理
    form.on('submit(priceSubFil)', function(data) {
        $.ajax({
            type: "post",
            url: ctx + "/adjustPrice/subAdjustPrice.html",
            dataType: "json",
            data: { data: JSON.stringify(data.field) },
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    active['reload'].call();
                    layer.msg("处理成功");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });
    
    $("#batchUpadateStatus").click(function (){
    	  var checkStatus = table.checkStatus('intable')
          ,data = checkStatus.data;
    	  if(data.length==0){
    		  layer.msg("请选择需要处理的信息！");
    		  return;
    	  }
    	  $("#checkHandleForm input[name='changetype']").val(changetype);
    	  $("#checkHandleForm input[name='batchData']").val(JSON.stringify(data));
    	  var index = layer.open({
              type: 1,
              title: "销售处理",
              shade: 0, //遮罩透明度
              area: ["800px", "600px"],
              content: $("#proHandleLayer"),
              end: function() {
                  $("#checkHandleForm")[0].reset();
              },
              btn: ['提交', '关闭'],
              yes: function(index, layero) {
                  $("#submitEbayTortDevSuggest").click();
              }
          });
    });
    
    
    $('#exportAdjustInfo_Temp').click(function () {
        var index = layer.open({
            title: '导出调价通知信息',
            type: 1,
            btn: ['导出', '关闭'],
            content: $('#exportAdjustPriceInfotpl').html(),
            area: ['650px', '450px'],
            success: function () {
                initNotNull('#exportAdjustInfoForm_producttpl')
                laydate.render({elem: '#beginTime_export_adjust_tpl'})
                laydate.render({elem: '#endTime_export_adjust_tpl'})
                form.render('select')
            },
            yes: function () {
                if (!checkNotNull("#exportAdjustInfoForm_producttpl")) {
                    return
                }
                var data = {
                    beginTime: $('#beginTime_export_adjust_tpl').val().replace(/\-/g,"")+'000000',
                    endTime: $('#endTime_export_adjust_tpl').val().replace(/\-/g,"")+'235959',
                    platCode:$("#exportAdjustInfoForm_producttpl select[name='Export_platCodeSel']").val()
                }
                adjust_export(data);
                
                layer.close(index);
            }
        })

    })
    
    function adjust_export(data){
    	console.log(data);
        if(data.platCode){
            submitForm(data, ctx + '/adjustPrice/exportAdjustInfo.html')
        }else{
            layer.msg("选择平台");
        }
    }
    
})