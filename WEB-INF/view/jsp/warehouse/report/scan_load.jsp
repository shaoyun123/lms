<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>扫描装车统计</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" action="" id="scanload_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">扫描时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="startAndEndTime" id="scanload_createTime_input" autocomplete="off" class="layui-input" placeholder='选择日期'>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">扫描人</label>
                                <div class="layui-input-block">
                                    <select name="creatorId" id="scanload_creator_sel" lay-search ></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入库单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="storageNumber" id="scanload_storageNumber_input" autocomplete="off" class="layui-input" placeholder='入库单号'>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否已审核</label>
                                <div class="layui-input-block">
                                    <select name="processStatus" id="scanload_processStatus_sel" lay-search >
                                        <option value="">全部</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="scanload_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm" type="reset" >清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="scanload_tab">
                <div class="layui-tab" lay-filter="scanload_tab">
                    <ul class="layui-tab-title" style="margin: 0px;">
                        <li class="layui-this" tab_type="1" >扫描装车明细(<span id="scanload_detail_num"></span>)</li>
                        <li  tab_type="2" >扫描装车汇总(<span id="scanload_count_num"></span>)</li>
                        <div style='float:right;line-height: 40px;'>
                            <button class="layui-btn layui-btn-sm layui-btn-normal" id="scanload_export_btn">导出(六个月之内)</button>
                        </div>
                    </ul>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="scanload_detail_data_table" style="margin: 0px;"></table>
                        </div>
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="scanload_count_data_table" style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="scanload_createTime_tpl">
    {{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}
</script>
<script type="text/html" id="scanload_auditTime_tpl">
    {{ Format(d.auditTime,"yyyy-MM-dd hh:mm:ss")}}
</script>

<!--是否已审核-->
<script type="text/html" id="scanload_processStatus_tpl">
    {{# if(d.processStatus == 0){ }}
    <span style="color:#FF5722">否</span>
    {{# }else if(d.processStatus == 1){   }}
    <span style="color:green;">是</span>
    {{# }else if(d.processStatus == 3){   }}
    <span style="color:#FF5722">否</span>
    {{# } }}
</script>


<script type="text/javascript" src="${ctx}/static/js/warehouse/scanload.js"></script>