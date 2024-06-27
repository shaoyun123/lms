<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>国家映射</title>
<style>
    #voice_speech_searchForm .layui-form-item{
        margin-bottom:0
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="voice_speech_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">中文国家名称</label>
                                <div class="layui-input-block">
                                    <input type="text" id="cn_country_name" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">国家英文名</label>
                                <div class="layui-input-block">
                                    <input type="text" id="en_country_name" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">国家英文简称</label>
                                <div class="layui-input-block">
                                    <input type="text" id="simple_country_name" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="sys_country_SearchBtn">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="voice_speech_card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="sys_country_tab_filter">
                        <ul class="layui-tab-title">
                            <div style="float:left;margin: 3px 0 0 12px">
                                <li class="layui-this" id="sys_country_mapping_li">(<span id="sys_country_tolnum_span_num"></span>)</li>
                            </div>

                            <div style="float:right;margin: 3px 0 0 5px">
                                <button type="button" id="add_countryMap" class="layui-btn layui-btn-sm layui-btn-normal">新增</button>
                            </div>
                        </ul>
                        <div class="layui-tab-content" id="country_div" style="">
                            <table id="sys_country_table" lay-filter="sys_country_table"></table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="addSyscountryMappingtpl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="sys_country_addForm"  lay-filter="voice_addForm" autocomplete="off">
                        <div class="layui-form-item">
                            <label class="layui-form-label">中文国家名称</label>
                            <div class="layui-input-block">
                                <input name="cn_name" id="cn_name" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">英文简称</label>
                            <div class="layui-input-block">
                                <input name="en_simple_name" id="en_simple_name" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">英文全称</label>
                            <div class="layui-input-block">
                                <input name="en_full_name" id="en_full_name" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item" style="display: none">
                            <label class="layui-form-label">id</label>
                            <div class="layui-input-block">
                                <input name="id" id="id" class="layui-input">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="busiMudBar">
    {{# if(d.businessModule != null){ }}
        {{# if(d.businessModule == '1'){ }}
        <span style="">语音播报模块</span>
        {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="country_processBar">
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-xs" lay-event="delete"> 删除</a>
</script>
<script type="text/javascript">
    var tableData;
    layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            element = layui.element,
            laydate = layui.laydate,
            $ = layui.$;
        form.render(null, 'component-form-element');
        element.render('breadcrumb', 'breadcrumb');
        form.render('select')
        var data = sys_country_getSerachData();
        tableReload(data);

        function tableReload(data){
            table.render({
                elem: "#sys_country_table",
                method:'post',
                url: ctx + "/sys/querySysCountry.html",
                cols: [[
                    { field: "id", title: "id" },
                    { field: "cnName", title: "中文名称"},
                    { field: "enSimpleName", title: "英文简称"},
                    { field: "enFullName", title: "英文全称"},
                    { title: '操作', align: 'center', toolbar: '#country_processBar' ,width:"30%"}
                ]],
                where:data,
                page:false,
                id:"sys_country_table",
                limits:[10,20,50],
                limit:10,
                done:function(res, curr, count){
                    $("[data-field='id']").css('display', 'none');
                    $("#sys_country_tolnum_span_num").text("共"+res.data.length+"条");
                }
            });
        }



        /**
         * 获取搜索参数
         */
        function  sys_country_getSerachData() {
            var obj = new Object();
            var simple_country_name = $.trim($("#simple_country_name").val());
            var cn_country_name =$.trim($("#cn_country_name").val());
            var en_country_name =$.trim($("#en_country_name").val());
            if(simple_country_name!=''){
                obj.enSimpleName = simple_country_name;
            }
            if(cn_country_name!=''){
                obj.cnName = cn_country_name;
            }
            if(en_country_name!=''){
                obj.enFullName = en_country_name
            }
            console.log(obj)
            return obj;
        };
        $("#add_countryMap").click(function(){
            //添加活动登记按钮
            var index = layer.open({
                title: '新增国家映射',
                type: 1,
                btn: ['上传', '关闭'],
                content: $('#addSyscountryMappingtpl').html(),
                area: ['650px', '450px'],
                success: function () {
                    form.render('select')
                },
                yes: function () {
                    var en_full_name = $.trim($("#en_full_name").val());
                    var en_simple_name =$.trim($("#en_simple_name").val());
                    var cn_name =$.trim($("#cn_name").val());
                    if(en_simple_name==null || en_full_name=='' ||cn_name=='' ){
                        layer.msg("请填写完整！")
                        return
                    }else{
                        var obj = {};
                        obj.enFullName = en_full_name;
                        obj.enSimpleName = en_simple_name;
                        obj.cnName = cn_name;
                        $.ajax({
                            beforeSend: function(){
                                loading.show();
                            },
                            url: ctx + '/sys/saveSysCountry.html',
                            type: 'POST',
                            data: JSON.stringify(obj),
                            contentType: "application/json;charset=utf-8",
                            dataType:"json",
                            success: function(data) {
                                if(data.code='0000'){
                                    layer.msg("添加成功")
                                }else{
                                    layer.msg(data.msg)
                                }
                                loading.hide()
                                var whereData = sys_country_getSerachData();
                                tableReload(whereData);

                            },
                            error: function() {
                                loading.hide()
                            }
                        });
                        layer.closeAll()
                    }
                }
            })
        })
        $("#sys_country_SearchBtn").click(function () {
            var whereData = sys_country_getSerachData();
            tableReload(whereData);
        });


        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(sys_country_table)', function (obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var id = data.id;
            if (layEvent === 'edit') {
                var index = layer.open({
                    type: 1,
                    title: '修改国家映射',
                    area: ['600px', '400px'],
                    btn: ['保存','取消'],
                    shadeClose: false,
                    content: $('#addSyscountryMappingtpl').html(),
                    success: function () {
                        $("#cn_name").val(data.cnName);
                        $("#en_simple_name").val(data.enSimpleName);
                        $("#en_full_name").val(data.enFullName);
                        $("#id").val(data.id);
                    },
                    yes: function (index, layero) {
                        var en_full_name = $.trim($("#en_full_name").val());
                        var en_simple_name =$.trim($("#en_simple_name").val());
                        var cn_name =$.trim($("#cn_name").val());
                        if(en_simple_name==null || en_full_name=='' ||cn_name=='' ){
                            layer.msg("请填写完整！")
                            return
                        }else {
                            var obj = {};
                            obj.enFullName = en_full_name;
                            obj.enSimpleName = en_simple_name;
                            obj.cnName = cn_name;
                            obj.id= id;
                            $.ajax({
                                beforeSend: function(){
                                    loading.show();
                                },
                                url: ctx + '/sys/saveSysCountry.html',
                                type: 'POST',
                                data: JSON.stringify(obj),
                                contentType: "application/json;charset=utf-8",
                                dataType: "json",
                                success: function (data) {
                                    if(data.code='000'){
                                        layer.msg("修改成功")
                                        layer.close(index)
                                    }else{
                                        layer.msg(data.msg)
                                    }
                                    var whereData = sys_country_getSerachData();
                                    tableReload(whereData);
                                    loading.hide()
                                },
                                error: function () {
                                    loading.hide()
                                }
                            });
                        }
                    }
                })
            }else if(layEvent === 'delete'){
                var index = layer.confirm('确认删除该条数据吗',{btn: ['确认', '取消']},
                    function () {
                        $.ajax({
                            beforeSend: function(){
                                loading.show();
                            },
                            url: ctx + '/sys/deleteSysCountry.html',
                            type: 'POST',
                            data: {id:id},
                            dataType: "json",
                            success: function (data) {
                                if(data.code='000'){
                                    layer.msg("刪除成功")
                                    layer.close(index)
                                }else{
                                    layer.msg(data.msg)
                                }
                                var whereData = sys_country_getSerachData();
                                tableReload(whereData);
                                loading.hide()
                            },
                            error: function () {
                                loading.hide()
                            }
                        });
                        layer.close(index)
                    })

            }
        });
    });

</script>
