<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>lazada预售</title>
</head>
<body>
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="lazadaPreSalesForm"
                  lay-filter="lazadaPreSalesForm">
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">预售设置</label>
                        <div class="layui-input-block">
                            <input type="radio" name="preSale" value="YES" title="开启预售" checked>
                            <input type="radio" name="preSale" value="No" title="关闭预售">
                        </div>
                    </div>
                    <a style="float: right" class="layui-btn layui-btn-normal layui-btn-sm lazadaPreSales_submitSet">提交预售设置</a>
                </div>
            </form>
            <table class="layui-table" id="lazada_preSalesSettings_table"
                   lay-filter="lazada_preSalesSettings_table"></table>
        </div>
    </div>
</div>
</body>
</html>
<script type="text/javascript">
    let lazadaPreSale;
    layui.use(["admin", "form", "layer", "table", "formSelects", "element", "laydate"], function () {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            $ = layui.$;
        form.render();

        table.on('edit(lazada_preSalesSettings_table)', function(obj) {
            var value = obj.value //得到修改后的值
                , data = obj.data //得到所在行所有键值
                , field = obj.field; //得到字段
            if(field=='preorderDays'&&!(/^[+-]?\d+$/.test(value)&&/^[7-9]|[1-9]\d+$/.test(value))){
                layer.alert("仅支持大于等于7的正整数",{icon:7})
            }
        })

        let tableData = table.checkStatus('lazada_online_data_table').data;
        table.render({
            elem: '#lazada_preSalesSettings_table',
            data: tableData
            ,limit:tableData.length
            , cols: [[ //标题栏
                {type: "checkbox", width: 30, style: "vertical-align: top;"}
                , {field: 'storeAcctName', title: '店铺'}
                , {field: 'id', title: 'id',hide: true }
                , {field: 'itemId', title: 'item_id'}
                , {field: 'preorderDays', title: '预售天数<a style="color: #00b7ee;cursor:pointer;" class="preSalesSettings_batchEdit">（批量）</a>',edit: 'text'}
                , {field: 'preorderEnable', title: '预售状态'
                    , templet: `<div>状态:{{d.preorderEnable == true?'已开启':(d.preorderEnable == false?'已关闭' : '不支持')}}</div>`

            }, {field: 'result',width: '20%', title: '操作结果'}
            ]],done: function (res, curr, count) {
                $("[data-field=id]").hide()
            }
        });
        // 批量设置预售天数
        $(".preSalesSettings_batchEdit").click(function(){
            let str = `<form class="layui-form" style="margin: 10px;">
                    <div class="layui-form-item">
                        <label class="layui-form-label" style="width:170px">将所有商品预售天数设置为：</label>
                        <div class="layui-input-block" style="margin-left:200px;">
                            <input class="layui-input" placeholder="仅支持大于等于7的正整数">
                        </div>
                    </div>
            </form>`;
            layer.open({
                type: 1,
                title: '预售天数设置',
                content: str,
                area: ['30%', '200px'],
                btn: ['确定', '关闭'],
                success: function (layero, index) {
                    form.render();
                },
                yes: function (index, layero) {
                    let val = layero.find('input').val();
                    if(/^[+-]?\d+$/.test(val)&&/^[7-9]|[1-9]\d+$/.test(val)){
                        table.cache.lazada_preSalesSettings_table.forEach(item => {
                            item.preorderDays = val
                        })
                        let $trs = $("#lazada_preSalesSettings_table").next().find('tbody tr')
                        for(var i=0; i< $trs.length; i++){
                            $($trs[i]).find('[data-field=preorderDays] div').text(val)
                        };
                        layer.close(index);
                    }else{
                        layer.alert("仅支持大于等于7的正整数",{icon:7})
                    }
                }
            })
        })
        // 提交预售设置
        $(".lazadaPreSales_submitSet").click(function(){
            let checkData = table.checkStatus('lazada_preSalesSettings_table').data;
            let formData = serializeObject($("#lazadaPreSalesForm")),arr = [];
            if(checkData.length <= 0){
                return layer.alert('请选中需要提交的数据',{icon:7})
            }
            for(let i=0,len=checkData.length;i<len;i++){
                if(formData.preSale == 'YES'&&!checkData[i].preorderDays){ // 开启。天数必填
                    return layer.alert("请填写预售天数",{icon:7})
                }
                if(checkData[i].preorderDays&&(!/^[+-]?\d+$/.test(checkData[i].preorderDays)||!/^[7-9]|[1-9]\d+$/.test(checkData[i].preorderDays))){
                    return layer.alert("仅支持大于等于7的正整数",{icon:7})
                }
                arr.push({
                    id:checkData[i].id,
                    storeAcctId:checkData[i].storeAcctId,
                    preorderEnable:formData.preSale,
                    preorderDays:checkData[i].preorderDays
                })
            }
            commonReturnPromise({
                url: `/lms/onlineProductLazada/updatePreorder`,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                params:JSON.stringify(arr)
            }).then(function(result){
                layer.alert('提交队列成功，请等待...')
                lazadaOffShelvesTUnit = setInterval(function () {
                    sel(result, "")
                }, 5000);
            })
        })
        /**
         *  查询操作结果
         * @param batchNo 批次号
         * @param operationType
         */
        function sel(batchNo , operationType) {
            var trObj = $('#lazada_preSalesSettings_table').next().find('tbody tr');
            var count = 0;
            for (var i = 0; i < trObj.length; i++) {
                var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                var resultMsg = trObj.eq(i).find('[data-field="result"]').find('.layui-table-cell').text();
                if ((resultMsg == '' || resultMsg == null) && checkStat) {
                    count++;
                }
            }
            if (count == 0) {
                clearInterval(lazadaOffShelvesTUnit);
                return;
            }

            $.ajax({
                type: "POST",
                url: ctx + "/sys/selectResult.html",
                data: {'batchNo': batchNo},
                async: true,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        let data = returnData.data;
                        for (var i = 0; i < trObj.length; i++) {
                            let checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                            let id = trObj.eq(i).find('[data-field="id"]').find('.layui-table-cell').text();
                            let resultMsg = trObj.eq(i).find('[data-field="result"]').find('.layui-table-cell').text();
                            let logMsg = data[id];
                            // 818398891
                            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                                if (logMsg.includes('成功')) {
                                    trObj.eq(i).find('[data-field="result"]').find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                                } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                    trObj.eq(i).find('[data-field="result"]').find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                                }
                            }
                        }
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                    clearInterval(lazadaOffShelvesTUnit);
                }
            });
        }
    })
</script>
