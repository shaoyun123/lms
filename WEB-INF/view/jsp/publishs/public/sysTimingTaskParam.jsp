<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>标零补货参数</title>
<style>
    #sys_timing_task_param_searchForm .layui-form-item{
        margin-bottom:0
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md15 layui-col-lg15">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="sys_timing_task_param_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">任务名称</label>
                                <div class="layui-input-block">
                                    <input type="text" id="title" name="title" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">jobHandler</label>
                                <div class="layui-input-block">
                                    <input type="text" id="jobHandler" name="jobHandler" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="sys_timing_task_queryBtn">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="sys_timing_task_param_card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="sys_timing_task_param_tab_filter">
                        <ul class="layui-tab-title">
                            <div style="float:right;margin: 3px 0 0 5px">
                                <permTag:perm funcCode="add_timing_param_btn">
                                    <button type="button" id="add_timing_task" class="layui-btn layui-btn-sm layui-btn-normal">新增</button>
                                </permTag:perm>
                            </div>
                        </ul>
                        <div class="layui-tab-content" id="issue_processing_div" style="">
                            <table id="sys_timing_task_param_table" lay-filter="sys_timing_task_param_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="addTimingTaskSpeechtpl">
    <div class="p20">
        <form class="layui-form layui-form-pane mt20" id="timing_nfoForm_producttpl"  lay-filter="timing_nfoForm_producttpl" autocomplete="off" >
            <div class="layui-form-item">
                <label class="layui-form-label">任务名称<span style="color: red">*</span></label>
                <div class="layui-input-block" notNull>
                    <input name="title" class="layui-input" width="200" required="true">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">jobHandler<span style="color: red">*</span></label>
                <div class="layui-input-block">
                    <input name="jobHandler" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品状态</label>
                <div class="layui-input-block">
                    <select name="prod_status">
                        <option value="">全部</option>
                        <option value='1'>在售<option>
                        <option value='0'>停售<option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">任务类型<span style="color: red">*</span></label>
                <div class="layui-input-block">
                    <select name="job_type" id="job_type"  xm-select="job_typetpl" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='job_typetpl'>
                        <%-- <option value="999"></option> --%>
                        <option value='1'>标零<option>
                        <option value='2'>补货<option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed"></font>仓库</label>
                <div class="layui-input-block">
                    <select name="stockLocation"></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">条件参数</label>
                <div class="layui-input-block disflex">
                    <div style="width:200px">
                        <select name="param_type" id="param_type">
                            <option value=""></option>
                        </select>
                    </div>
                    <input name="paramNum" class="layui-input" style="width:650px">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed"></font>在线数量</label>
                <div class="layui-input-block disflex" style="align-items: center;">
                    <input type="number" class="layui-input ml10" placeholder="≥" name="onlineStockMin" onkeypress="commonKeyPressInputInt(event)">
                    <span style="color:#e6e6e6">——</span>
                    <input type="number" name="onlineStockMax" class="layui-input mr10"
                    placeholder="≤" onkeypress="commonKeyPressInputInt(event)">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">修改库存数量</label>
                <div class="layui-input-block">
                    <input name="stock" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <input name="remark" class="layui-textarea">
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="prodStatusTpl">
    {{# if(d.prodStatus != null){ }}
        {{# if(d.prodStatus == '1'){ }}
        <span>在售</span>
        {{# }else if(d.prodStatus == '0'){ }}
        <span>停售</span>
        {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="jobTypeTpl">
    {{# if(d.jobType != null){ }}
    {{# if(d.jobType == '1'){ }}
    <span>标零</span>
    {{# }else if(d.jobType == '2'){ }}
    <span>补货</span>
    {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="paramTypeTpl">
    {{# if(d.paramType != null){ }}
        {{# if(d.paramType == '1'){ }}
        <span>预计可用库存(含在途)≦</span>
        {{# }else if(d.paramType == '2'){ }}
        <span>预计可用库存(含在途)></span>
        {{# }else if(d.paramType == '3'){ }}
        <span>预计可用库存(不含在途)≦</span>
        {{# }else if(d.paramType == '4'){ }}
        <span>预计可用库存(不含在途)></span>
        {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="processBar">
    <permTag:perm funcCode="update_timing_param_btn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
    </permTag:perm>
    <permTag:perm funcCode="delete_timing_param_btn">
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete">删除</a>
    </permTag:perm>
    <permTag:perm funcCode="add_filter_param_btn">
        <a class="layui-btn layui-btn-xs" lay-event="filter">不处理条件</a>
    </permTag:perm>
</script>
<script type="text/html" id="filterBar">
    <permTag:perm funcCode="add_filter_timing_param_btn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete">删除</a>
    </permTag:perm>
</script>
<script>
    var sysTiming_plat_code = 'sss';
    var open_jobHandler = 'SSSS';
    layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            $ = layui.$;
        form.render(null, 'component-form-element');
        form.render('select')
        load();
        function load(){
            table.render({
                elem: "#sys_timing_task_param_table",
                method:'post',
                url: ctx + "/sysTiming/getTimingTaskInfo.html",
                cols: [[
                    { field: "id", title: "id" },
                    { field: "title", title: "任务名称"},
                    { field: "jobHandler", title: "jobHandler"},
                    { field: "prodStatus", title: "商品状态",templet:'#prodStatusTpl'},
                    { field: "jobType", title: "任务类型",templet:'#jobTypeTpl'},
                    { field: "paramType", title: "条件参数",templet:'#paramTypeTpl'},
                    { field: "paramNum", title: "数值"},
                    { field: "stock", title: "修改库存数量"},
                    { field: "remark", title: "备注"},
                    { title: '操作', align: 'center', toolbar: '#processBar'}
                ]],
                where:timing_task_getSerachData(),
                page:false,
                id:"sys_timing_task_param_table",
                limits:[10,20,50],
                limit:10,
                done:function(res, curr, count){
                    $("[data-field='id']").css('display', 'none');
                }
            });
        }
        /**
         * 获取搜索参数
         */
        function  timing_task_getSerachData() {
            var title = $.trim($("#sys_timing_task_param_searchForm input[name='title']").val());
            var jobHandler = $.trim($("#sys_timing_task_param_searchForm input[name='jobHandler']").val());
            console.log(title)
            var obj = {};
            obj.title = title
            obj.jobHandler = jobHandler;
            return obj;
        };

        /**
         * 获取页面参数
         */
        function  timing_task_getInfoData() {
            var title = $.trim($("#timing_nfoForm_producttpl input[name='title']").val());
            var jobHandler = $.trim($("#timing_nfoForm_producttpl input[name='jobHandler']").val());
            var jobType = $.trim($("#timing_nfoForm_producttpl select[name='job_type']").val());
            var paramType = $.trim($("#timing_nfoForm_producttpl select[name='param_type']").val());
            var paramNum = $.trim($("#timing_nfoForm_producttpl input[name='paramNum']").val());
            var prodStatus = $.trim($("#timing_nfoForm_producttpl select[name='prod_status']").val());
            var stock = $.trim($("#timing_nfoForm_producttpl input[name='stock']").val());
            var remark = $.trim($("#timing_nfoForm_producttpl input[name='remark']").val());
            const stockLocation = $.trim($("#timing_nfoForm_producttpl select[name='stockLocation']").val())
            const onlineStockMin = $.trim($("#timing_nfoForm_producttpl input[name='onlineStockMin']").val())
            const onlineStockMax = $.trim($("#timing_nfoForm_producttpl input[name='onlineStockMax']").val())
            var data = new Object();
            data.title = title;
            data.jobHandler = jobHandler;
            data.jobType = jobType;
            data.paramType = paramType;
            data.paramNum = paramNum;
            data.prodStatus = prodStatus;
            data.stock = stock;
            data.remark = remark;
            data.stockLocation = stockLocation 
            data.onlineStockMin = onlineStockMin
            data.onlineStockMax = onlineStockMax
            return data;
        };
        //下拉选项
        form.on('select(job_typetpl)', function(data){
            if(data.value=='1'){
                $('#param_type').html('<option value=""><option><option value="1">预计可用库存(含在途)≦<option><option value="3">预计可用库存(不含在途)≦<option>');
                form.render('select');
            }else if(data.value=='2'){
                $('#param_type').html('<option value=""><option><option value="2">预计可用库存(含在途)><option><option value="4">预计可用库存(不含在途)><option>');
                form.render('select');
            }else{
                $('#param_type').html('<option value=""><option>');
            }
        });
        $("#add_timing_task").click(function(){
            var index = layer.open({
                title: '新增定时任务参数页面',
                type: 1,
                btn: ['保存', '关闭'],
                content: $('#addTimingTaskSpeechtpl').html(),
                area: ['1000px', '600px'],
                success: function () {
                    commonReturnPromise({
                        url:ctx+'/prodWarehouse/getAuthedProdWarehouse.html',
                        type:'post',
                    }).then(res=>{
                        let optionStr = '<option value="">请选择</option>'
                        res.forEach(item => {
                            optionStr += "<option value=" + item.id + ">" + item.warehouseName + "</option>"
                        });
                        $("#timing_nfoForm_producttpl select[name='stockLocation']").html(optionStr);
                        form.render()
                    })
                    form.render('select')
                },
                yes: function () {
                    const param = timing_task_getInfoData()
                    if(param.stockLocation==''){
                        return layer.msg('请选择仓库')
                    }
                    if(param.onlineStockMin ===''){
                        return layer.msg('请输入在线数量的最小值')
                    }
                    if(param.onlineStockMax===''){
                        return layer.msg('请输入在线数量的最大值')
                    }
                    if(Number(param.onlineStockMin)>Number(param.onlineStockMax)){
                        return layer.msg('在线数量的区间值不符合规范，请重新输入')
                    }
                    $.ajax({
                        beforeSend: function(){
                            loading.show();
                        },
                        url: ctx + '/sysTiming/saveTimingTaskInfo.html',
                        type: 'POST',
                        data: JSON.stringify(param),
                        async: true,
                        contentType:'application/json;charset=UTF-8',
                        dataType: "json",
                        success: function(returnData) {
                            loading.hide()
                            if(returnData.code !='0000'){
                                layer.msg(returnData.msg)
                            }else{
                                layer.closeAll()
                                load();
                            }
                        },
                        error: function() {
                            layer.closeAll()
                            loading.hide()
                        }
                    });
                }
            })
        })
        $("#sys_timing_task_queryBtn").click(function () {
            load();
        });

        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(sys_timing_task_param_table)', function (obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var id = data.id;
            if (layEvent === 'edit') {
                var index = layer.open({
                    type: 1,
                    title: '修改定时任务参数配置',
                    area: ['1000px', '600px'],
                    btn: ['保存','取消'],
                    shadeClose: false,
                    content: $('#addTimingTaskSpeechtpl').html(),
                    success: function () {
                        $("#timing_nfoForm_producttpl input[name='title']").val(data.title);
                        $("#timing_nfoForm_producttpl input[name='jobHandler']").val(data.jobHandler);
                        $("#timing_nfoForm_producttpl select[name='job_type']").find("option[value="+data.jobType+"]").prop("selected",true);
                        if(data.jobType=='1'){
                            $('#param_type').html('<option value=""><option><option value="1">预计可用库存(含在途)≦<option><option value="3">预计可用库存(不含在途)≦<option>');
                        }else if(data.jobType=='2'){
                            $('#param_type').html('<option value=""><option><option value="2">预计可用库存(含在途)><option><option value="4">预计可用库存(不含在途)><option>');
                        }
                        $("#job_type").attr("disabled","disabled");
                        $("#timing_nfoForm_producttpl select[name='param_type']").find("option[value="+data.paramType+"]").prop("selected",true);
                        $("#timing_nfoForm_producttpl input[name='paramNum']").val(data.paramNum);
                        $("#timing_nfoForm_producttpl select[name='prod_status']").find("option[value="+data.prodStatus+"]").prop("selected",true);
                        $("#timing_nfoForm_producttpl input[name='stock']").val(data.stock);
                        $("#timing_nfoForm_producttpl input[name='remark']").val(data.remark);
                        $("#timing_nfoForm_producttpl input[name='onlineStockMin']").val(data.onlineStockMin);
                        $("#timing_nfoForm_producttpl input[name='onlineStockMax']").val(data.onlineStockMax);
                        commonReturnPromise({
                            url:ctx+'/prodWarehouse/getAuthedProdWarehouse.html',
                            type:'post',
                        }).then(res=>{
                            let optionStr = '<option value="">请选择</option>'
                            res.forEach(item => {
                                const stockLocationSelected = item.id == data.stockLocation ? 'selected' : ''
                                optionStr += "<option value=" + item.id + " " + stockLocationSelected +">" + item.warehouseName + "</option>"
                            });
                            $("#timing_nfoForm_producttpl select[name='stockLocation']").html(optionStr);
                            form.render()
                        })
                        form.render('select')
                    },
                    yes: function (index, layero) {
                        var obj = timing_task_getInfoData();
                        if(obj.stockLocation==''){
                            return layer.msg('请选择仓库')
                        }
                        if(obj.onlineStockMin ===''){
                            return layer.msg('请输入在线数量的最小值')
                        }
                        if(obj.onlineStockMax===''){
                            return layer.msg('请输入在线数量的最大值')
                        }
                        if(Number(obj.onlineStockMin)>Number(obj.onlineStockMax)){
                            return layer.msg('在线数量的区间值不符合规范，请重新输入')
                        }
                        obj.id = id;
                        $.ajax({
                            beforeSend: function(){
                                loading.show();
                            },
                            url: ctx + '/sysTiming/saveTimingTaskInfo.html',
                            type: 'POST',
                            data: JSON.stringify(obj),
                            async: true,
                            contentType:'application/json;charset=UTF-8',
                            dataType: "json",
                            success: function(returnData) {
                                loading.hide()
                                if(returnData.code !='0000'){
                                    layer.msg(returnData.msg)
                                }else{
                                    layer.closeAll()
                                    load();
                                }
                            },
                            error: function() {
                                layer.closeAll()
                                loading.hide()
                            }
                        });
                    }
                })
            }else if(layEvent === 'delete'){
                layer.confirm('是否删除此条记录？', function (result) {
                    if (result) {
                        $.ajax({
                            url: ctx + '/sysTiming/deleteTimingInfo.html',
                            data: {"id": id},
                            dataType: "json",
                            success: function (returnData) {
                                if (returnData.code == "0000") {
                                    layer.msg('操作成功');
                                    load();
                                } else {
                                    layer.msg(returnData.msg);
                                }
                            },
                            error: function () {
                                layer.msg("服务器正忙");
                            }
                        });
                    }
                });
            }else{
                if(data.jobHandler.toLowerCase().indexOf('wish')>-1){
                    sysTiming_plat_code='wish';
                }
                if(data.jobHandler.toLowerCase().indexOf('ebay')>-1){
                    sysTiming_plat_code='ebay';
                }
                if(data.jobHandler.toLowerCase().indexOf('shopee')>-1){
                    sysTiming_plat_code='shopee';
                }
                if(data.jobHandler.toLowerCase().indexOf('amazon')>-1){
                    sysTiming_plat_code='amazon';
                }
                if(data.jobHandler.toLowerCase().indexOf('joom')>-1){
                    sysTiming_plat_code='joom';
                }
                if(data.jobHandler.toLowerCase().indexOf('lazada')>-1){
                    sysTiming_plat_code='lazada';
                }
                if(data.jobHandler.toLowerCase().indexOf('fyndiq')>-1){
                    sysTiming_plat_code='fyndiq';
                }
                if(data.jobHandler.toLowerCase().indexOf('fanno')>-1){
                    sysTiming_plat_code='fanno';
                }
                if(data.jobHandler.toLowerCase().indexOf('walmart')>-1){
                    sysTiming_plat_code='walmart';
                }
                if(data.jobHandler.toLowerCase().indexOf('mercado')>-1){
                    sysTiming_plat_code='mercado';
                }
                if(data.jobHandler.toLowerCase().indexOf('aliexpress')>-1 || data.jobHandler.toLowerCase().indexOf('smt')>-1){
                    sysTiming_plat_code='aliexpress';
                }
                if(data.jobHandler.toLowerCase().indexOf('tiktok')>-1){
                    sysTiming_plat_code='tiktok';
                }
                var index = layer.open({
                    type: 1,
                    id: Date.now(),
                    title: '不处理条件{'+data.title+'}',
                    btn: ['关闭'],
                    area: ['80%', '70%'],
                    success: function () {
                        open_jobHandler = data.jobHandler
                        layui.view(this.id).render("route/iframe/msg/sysTimingFilterParam").done(function () {

                        })
                    },
                    yes: function () {
                        layer.close(index)
                    },
                    end: function () {
                    }
                })
            }
        });

    });
</script>
