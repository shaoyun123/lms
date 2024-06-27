<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%--copy wish在线商品--批量修改标题和图片--%>
<title>fyndiq修改标题/描述</title>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .hide {
        display: none;
    }

    .layui-textarea {
        min-height: 200px;
    }

    .icon_group i {
        color: #ccc;
        line-height: 20px;
        cursor: pointer;
    }

    #LAY-fyndiq-decriptInfo .layui-card-body form {
        padding: 10px 0 !important;
        border-bottom: 1px solid #e6e6e6 !important;
    }
</style>
<div class="layui-fluid" id="LAY-fyndiq-decriptInfo">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="applyForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md2">
                                <label class="layui-form-label">标题</label>
                                <div class="layui-input-block">
                                    <input type="text" name="origin_title" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2">
                                <label class="layui-form-label">替换为</label>
                                <div class="layui-input-block">
                                    <input type="text" name="new_title" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2">
                                <label class="layui-form-label">描述</label>
                                <div class="layui-input-block">
                                    <input type="text" name="origin_descrip" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2">
                                <label class="layui-form-label">替换为</label>
                                <div class="layui-input-block">
                                    <input type="text" name="new_descrip" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2">
                                <div class="layui-input-block">
                                    <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" lay-submit
                                            type="button" id="fyndiqModTitle_applyBtn"
                                            lay-filter="fyndiqModTitle_applyBtn">应用
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex pl10">
                        <div>
                            <div class="numCount" title="数量">数量(<span id="modifyTitle_span_fyndiq"></span>)</div>
                        </div>
                        <div>
                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal"
                                    id="fyndiq_modifySubtitle">批量修改
                            </button>
                        </div>
                    </div>
                    <div class="layui-tab-content">
                        <table class="layui-table" id="fyndiqmodifyTitle_table" lay-filter="fyndiqmodifyTitle_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="fyndiq_online_hide_table" style="display: none;"></table>
<script>
    function editTitle(obj) {
        obj.addClass('hide').siblings('textarea').removeClass('hide');
    }

    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate', 'table'], function () {
        var formSelects = layui.formSelects,
            table = layui.table,
            form = layui.form,
            tableIns = {};
        form.render('checkbox');
        form.render('radio');
        form.render('select');
        //初始化
        let storeSkuStrFyndiq = window.localStorage.getItem("storeSkuStrFyndiq"),
            storeAcctIdStrFyndiq = window.localStorage.getItem("storeAcctIdStrFyndiq");

        if (storeSkuStrFyndiq != undefined && storeSkuStrFyndiq != '') {
            let data = {}
            data.skuStr = storeSkuStrFyndiq
            data.skuSearchType = 2
            data.storeAcctIdStr = storeAcctIdStrFyndiq
            //执行重载
            tableReload(data);
        }

        function tableReload(data) {
            tableIns = table.render({
                method: 'post',
                elem: '#fyndiqmodifyTitle_table',
                url: ctx + '/fyndiq/product/batch/query/stock.html', //数据接口
                page: true, //开启分页
                cols: [
                    [ //表头
                        {type: 'checkbox', templet: '#tpl_1',}, {field: 'id', title: 'id',}, {field: 'storeAcctId', title: 'storeAcctId',}, {
                        field: 'storeAcctName',
                        title: '店铺',
                        width: '100'
                    }, {
                        field: 'storeSku',
                        title: '店铺子SKU',
                        width: '100'
                    }, {field: 'prodSSku', title: '商品子SKU', width: '80'}, {
                        field: 'title',
                        title: '标题',
                        templet: '#new_title',
                        width: '200'
                    },
                        {field: 'description', title: '描述', templet: '#new_proDec',width: '400'},
                        {
                            field: "fyndiqStatus",
                            title: "fyndiq状态",
                            width: '100'
                        }, {field: 'returnData', title: '操作结果'}
                    ]
                ],
                where: data,
                id: "fyndiqmodifyTitle_table",
                height: 500,
                limits: [10, 20, 50],
                limit: 10,
                done: function (res, curr, count) {
                    $("#LAY-fyndiq-decriptInfo [data-field='id']").css('display', 'none');
                    $("#LAY-fyndiq-decriptInfo [data-field='storeAcctId']").css('display', 'none');
                    $("#modifyTitle_span_fyndiq").text("共" + count + "条");
                    $("#LAY-fyndiq-decriptInfo [data-field='0']").eq(1).find('.laytable-cell-checkbox').css('display', 'none')
                    restore(res.data);
                    deleteall();
                    commonAddEventTitleToggle($('#LAY-fyndiq-decriptInfo'))
                },
                created: function (res) {
                    if (res.data) {
                        res.data.unshift({id: -1})
                    }
                }
            });
        }
        /**
         * 批量修改
         */
        $("#fyndiq_modifySubtitle").click(function () {
            var fyndiq_arr = [];
            //获取表格行对象
            var trObj = $('#fyndiqmodifyTitle_table').next().find('.layui-table-body tbody').find('tr');

            for (var i = 0; i < trObj.length; i++) {
                var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                var obj = {};
                obj.id = trObj.eq(i).find('td').eq(1).find('div').text();
                obj.storeSku = trObj.eq(i).find('td').eq(4).find('div').text();
                obj.storeAcctId = trObj.eq(i).find('td').eq(2).find('div').text();
                obj.newTitle = trObj.eq(i).find('td').eq(6).find('textarea').val(); //新标题
                obj.newDescription = trObj.eq(i).find('td').eq(7).find('textarea').val(); //新描述

                if (checkStat && obj.id != -1) {
                    fyndiq_arr.push(obj);
                }
            }
            if (fyndiq_arr.length <= 0) {
                layer.msg("请选择需要修改的数据");
                return;
            }

            loading.show();
            $.ajax({
                type: "POST",
                url: ctx + "/fyndiq/product/batch/update/titleAndDescription",
                data: JSON.stringify(fyndiq_arr),
                contentType:"application/json",
                success: function (data) {
                    loading.hide()
                    var trObj = $('#fyndiqmodifyTitle_table').next().find('.layui-table-body tbody').find('tr');
                    for (var i = 1; i < trObj.length; i++) {
                        if (trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked")) {
                            if(data.data[trObj.eq(i).find('td').eq(1).find('div').text()].indexOf("成功") != -1){
                                trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>修改成功</div>");
                            } else {
                                trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            }
                        }
                    }
                }
            })
        });

        // 应用
        form.on('submit(fyndiqModTitle_applyBtn)', function (data) {
            var checkStatus = table.checkStatus('fyndiqmodifyTitle_table');
            if (checkStatus.data.length > 0 && tableIns) {
                var layFilterIndex = 'LAY-table-' + tableIns.config.index;
                var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
                    var tr = $(this).parents('tr');
                    var wh_title = tr.find('textarea[name="title_js"]').val() || tr.find('.title_js').text();
                    var wh_decription = tr.find('textarea[name="description_js"]').val() || tr.find('.description_js').text();
                    wh_title = replace_string(wh_title, data.field.origin_title, data.field.new_title);
                    wh_decription = replace_string(wh_decription, data.field.origin_descrip, data.field.new_descrip);
                    tr.find('textarea[name="title_js"]').val(wh_title);
                    tr.find('textarea[name="description_js"]').val(wh_decription);
                    tr.find('.title_js').text(wh_title);
                    tr.find('.description_js').text(wh_decription);
                });
            } else {
                layer.msg("请选择需要修改的数据！")
            }
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

    $('body').on('mouseover', '.errordata', function () {
        var content = $(this).next("textarea").val()
        layer.tips(content, $(this), {
            time: 3000
        });
    });

    // 还原图标
    function restore(data) {
        $('.icon_group i:first-child').click(function () {
            var field = $(this).parents('td').attr('data-field');
            colsoption(field, data)
        });
    }

    // 删除图标
    function deleteall() {
        $('.icon_group i:last-child').click(function () {
            var field = $(this).parents('td').attr('data-field');
            colsoption(field, {})
        });
    }

    function colsoption(field, data) {
        $('#LAY-fyndiq-decriptInfo td[data-field="' + field + '"]').each(function (index, item) {
            $(item).find('div .col_js').text(data[index] ? data[index][field] : '');
            $(item).find('div textarea').val(data[index] ? data[index][field] : '');
        })
    }

</script>
<%--标题--%>
<script type="text/html" id="new_title">
    {{# if (d.id == -1) { }}
    <div class="icon_group"></i><i class="layui-icon" title="还原">&#xe669;</i><i class="layui-icon" title="删除">&#xe640;</i></div>
    {{# } else { }}
    <div onclick="editTitle($(this));" class="title_js col_js">{{d.title || ''}}</div>
    <textarea class="layui-textarea hide ifFocusInput" style="height:28px" value="{{d.title || ''}}" data-prodsid="{{d.prodSId}}" name="title_js">{{d.title || ''}}</textarea>
    {{# } }}
</script>
<%--描述--%>
<script type="text/html" id="new_proDec">
    {{# if (d.id == -1) { }}
    <div class="icon_group"><i class="layui-icon restore" title="还原">&#xe669;</i><i class="layui-icon delete" title="删除">&#xe640;</i></div>
    {{# } else { }}
    <div onclick="editTitle($(this));" class="description_js col_js">{{d.description || ''}}</div>
    <textarea class="layui-textarea hide" style="height:28px" value="{{d.description || ''}}" name="description_js">{{d.description || ''}}</textarea>
    {{# } }}
</script>