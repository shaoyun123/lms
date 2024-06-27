<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>速卖通刊登达标</title>
<style>
    td[class="colspan_td"]>table>tbody tr:first-child td {
        border-top: none;
    }

    td[class="colspan_td"]>table>tbody tr:last-child td {
        border-bottom: none;
    }

    td[class="colspan_td"]>table>tbody tr td {
        border-left: none;
        border-right: none;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }

    th,
    td {
        text-align: center
    }

    .layui-row>div {
        margin-bottom: 10px;
    }

    .clearfix {
        *zoom: 1;
    }
    /*IE/6/7*/

    .clearfix:after {
        content: "\200B";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .fr {
        float: right;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card clearfix">
                <div class="layui-card-body">
                    <div class="layui-tab">
                        <div class="layui-tab-content">
                            <div class="layui-card-body">
                                <table class="layui-table" id="cs_table" lay-filter="cs_table"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="smt_category_require_edit">
<permTag:perm funcCode="smt_category_standard_code">
        <button type="button" class="layui-btn layui-btn-sm" lay-event="edit">设置</button>
</permTag:perm>
</script>

<script type="text/html" id="smt_category_requireLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="smt_category_require_FORM">
            <label class="layui-form-label">达标数</label>
            <div class="layui-input-inline" style="width:100px">
                <input type="number" name="standard" class="layui-input">
            </div>
        </form>
    </div>
</script>
<script>
	layui.use(['admin', 'form', 'laydate', 'table'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        table = layui.table,
        laydate = layui.laydate,
        form = layui.form;

    table.render({
        elem: '#cs_table',
        height: 'full-200',
        url: ctx + '/aliexpresslisting/liststandard.html' //数据接口
            ,
        title: '速卖通类目达标表',
        page: false //开启分页
            ,
        toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,
        totalRow: true //开启合计行
            ,
        cols: [
            [ //表头
                {
                    type: 'numbers'
                }, {
                    field: 'thumbnail',
                    title: '类目',
                    templet:'<div>{{d.cateCnName}}({{d.cateEnName}})</div>'
                }, {
                    field: 'standard',
                    title: '达标数',
                    width: 100,
                },
                { title: '操作', align: 'center',width: 100, toolbar: '#smt_category_require_edit'
                }
            ]
        ]
    });
    table.on('tool(cs_table)', function(obj){
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        console.log(data);
        if (layEvent === "edit") {
            var index = layer.open({
                type: 1,
                title: '设置达标数',
                // shade: 0, //遮罩透明度
                shadeClose: false,
                area: ['260px', '180px'],
                content: $('#smt_category_requireLayer').html(),
                end: function() {
                },
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    var req={};
                    req.id=data.id;
                    req.prodCateId=data.prodCateId;
                    req.standard=$("#smt_category_require_FORM input[name=standard]").val();
                    $.ajax({
                        type: "post",
                        url: ctx + '/aliexpresslisting/updatestandard.html',
                        dataType: "json",
                        data: req,
                        success: function (reutrnData) {
                            if (reutrnData.code != "0000") {
                                layer.msg(reutrnData.msg, {icon: 2})
                            } else {
                                layer.msg("类目：" + data.cateCnName + "  达标数更新成功");
                            }
                            table.reload('cs_table');
                            layer.closeAll()
                        }
                    });
                }

            })

        }
    });


});
</script>