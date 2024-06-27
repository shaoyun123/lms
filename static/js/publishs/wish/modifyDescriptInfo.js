layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate', 'table'], function() {
    var formSelects = layui.formSelects,
        table = layui.table,
        form = layui.form,
        tableIns = {};
    form.render('checkbox');
    form.render('radio');
    form.render('select');
    //初始化店铺/销售员/部门
    render_hp_orgs_users("#decriptInfoForm");
    //初始化
    var data = new Object();
    if (op_arr.length > 0) {
        data.idList = [];
        for (var i = 0; i < op_arr.length; i++) {
            data.idList.push(op_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if (op_arr.length > 0) {
        //执行重载
        tableReload(data);
    }

    function tableReload(data) {
        tableIns = table.render({
            method: 'post',
            elem: '#modifyTitle_table',
            url: ctx + '/wishModifyStock/getModigyTitle.html' //数据接口
                ,
            page: true //开启分页
                ,
            cols: [
                [ //表头
                    { type: 'checkbox', templet: '#tpl_1', }, { field: 'id', title: 'id', }, { field: 'storeAcct', title: '店铺', width: '100' }, { field: 'prodPSku', title: '商品父SKU', width: '80' }, { field: 'pSku', title: '店铺父SKU', width: '100' }, { field: 'title', title: '标题', templet: '#new_title', width: '200' }, { field: 'tags', title: 'tags', templet: '#title_tpl', width: '375' }, { field: 'prodDesc', title: '描述', templet: '#new_proDec', width: '375' }, { field: 'isPromotion', title: '是否黄钻', templet: '#wish_isPromotion' }, { field: "storeAcctId", title: "店铺id" }, { field: "storeProdPId", title: "平台父商品Id" }, { field: 'returnData', title: '操作结果', }
                ]
            ],
            where: data,
            id: "modifyTitle_table",
            height:500,
            limits: [10, 20, 50],
            limit: 10,
            done: function(res, curr, count) {
                commonAddEventTitleToggle($('#LAY-wish-decriptInfo'))
                $("#LAY-wish-decriptInfo [data-field='id']").css('display', 'none');
                $("#LAY-wish-decriptInfo [data-field='storeAcctId']").css('display', 'none');
                $("#LAY-wish-decriptInfo [data-field='storeProdPId']").css('display', 'none');
                $("#modifyTitle_span_wish").text("共" + count + "条");
                $("#LAY-wish-decriptInfo [data-field='0']").eq(1).find('.laytable-cell-checkbox').css('display', 'none')
                restore(res.data);
                deleteall();
            },
            created: function(res) {
                if (res.data) {
                    res.data.unshift({ id: -1 })
                }
            }
        });
    }
    $("#decriptInfoBtn").click(function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        reload: function() {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            var logisAttrContents = formSelects.value("selectAttr_store");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#decriptInfoForm input[name='sSkuList']").val());
            if (skuStr != "" && skuStr != null) {
                data.sSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);

            var salepersonId = $.trim($("#decriptInfoForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.searchType = $("#wish_modifyTitle_pskuSearchType").val(); //搜索类型

            //执行重载
            tableReload(data);
        }
    };
    /**
     * 批量修改
     */
    $("#wish_modifySubtitle").click(function() {
        var wish_arr = [];
        //获取表格行对象
        var trObj = $('#modifyTitle_table').next().find('.layui-table-body tbody').find('tr');
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");

            var obj = {};
            obj.id = trObj.eq(i).find('td').eq(1).find('div').text();
            obj.storeAcct = trObj.eq(i).find('td').eq(2).find('div').text();
            obj.prodPSku = trObj.eq(i).find('td').eq(3).find('div').text();
            obj.pSku = trObj.eq(i).find('td').eq(4).find('div').text();
            obj.newTitle = trObj.eq(i).find('td').eq(5).find('textarea').val(); //新标题
            obj.newTags = trObj.eq(i).find('td').eq(6).find('textarea').val(); //新标签
            obj.newProdDesc = trObj.eq(i).find('td').eq(7).find('textarea').val(); //新描述
            obj.isPromotion = trObj.eq(i).find('td').eq(8).find('div').text();
            obj.storeAcctId = trObj.eq(i).find('td').eq(9).find('div').text();
            obj.storeProdPId = trObj.eq(i).find('td').eq(10).find('div').text();
            if (checkStat && obj.id != -1) {
                wish_arr.push(obj);
            }
        }
        if (wish_arr.length <= 0) {
            layer.msg("请选择需要修改的数据");
            return;
        }
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/wishModifyStock/updateMainSubtitle.html",
            data: { 'wish_arr': JSON.stringify(wish_arr) },
            async: true,
            dataType: "JSON",
            success: function(data) {
                var trObj = $('#modifyTitle_table').next().find('.layui-table-body tbody').find('tr');
                for (var i = 1; i < trObj.length; i++) {
                    var arr_storeProdPId = trObj.eq(i).find('td').eq(10).find('div').text();
                    var msg = data.data[arr_storeProdPId];

                    if (msg != undefined) {
                        if (msg == "修改成功") {
                            trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:green'>" + data.data[arr_storeProdPId] + "</div>");
                        } else {
                            trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(11).find('.layui-table-cell').append("<textarea class='layui-hide'>" + data.data[arr_storeProdPId] + "</textarea>");
                        }
                    }
                }
                loading.hide()
            }
        })
    });

    form.on('submit(wishModTitle_applyBtn)', function(data) {
        var checkStatus = table.checkStatus('modifyTitle_table');
        if (checkStatus.data.length > 0 && tableIns) {
            var layFilterIndex = 'LAY-table-' + tableIns.config.index;
            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
            tableContainer.find('input[name="layTableCheckbox"]:checked').each(function() {
                var tr = $(this).parents('tr');
                var wh_title = tr.find('textarea[name="title_js"]').val() || tr.find('.title_js').text();
                var wh_tags = tr.find('textarea[name="tags_js"]').val() || tr.find('.tags_js').text();
                var wh_decription = tr.find('textarea[name="description_js"]').val() || tr.find('.description_js').text();
                wh_title = replace_string(wh_title, data.field.origin_title, data.field.new_title);
                wh_tags = replace_string(wh_tags, data.field.origin_tags, data.field.new_tags);
                wh_decription = replace_string(wh_decription, data.field.origin_descrip, data.field.new_descrip);
                tr.find('textarea[name="title_js"]').val(wh_title);
                tr.find('textarea[name="tags_js"]').val(wh_tags);
                tr.find('textarea[name="description_js"]').val(wh_decription);
                tr.find('.title_js').text(wh_title);
                tr.find('.tags_js').text(wh_tags);
                tr.find('.description_js').text(wh_decription);
            });
        } else {
            layer.msg("请选择需要修改的数据！")
        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});

$('body').on('mouseover', '.errordata', function() {
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });

});

// function replace_string(s1,s2,s3) {
//     if(s2){
//         s1 = s1.split(s2).join(s3);
//     }
//     return s1;
// }

function restore(data) {
    $('.icon_group i:first-child').click(function() {
        var field = $(this).parents('td').attr('data-field');
        colsoption(field, data)
    });
}

function deleteall() {
    $('.icon_group i:last-child').click(function() {
        var field = $(this).parents('td').attr('data-field');
        colsoption(field, {})
    });
}

function colsoption(field, data) {
    $('#LAY-wish-decriptInfo td[data-field="' + field + '"]').each(function(index, item) {
        $(item).find('div .col_js').text(data[index] ? data[index][field] : '');
        $(item).find('div textarea').val(data[index] ? data[index][field] : '');
    })
}