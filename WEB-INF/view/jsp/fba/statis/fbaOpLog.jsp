<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<link rel="stylesheet" href="${ctx}/static/teafram/teaFram.css">

<title>作业一览表</title>

<div class="layui-fluid" id="fbaOpLog">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="fbaOpLog_Form" lay-filter="fbaOpLog_Form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">作业员</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="支持多个,逗号分隔" name="opUserNameStr">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">工作时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="time" placeholder="区间,默认一个月" autocomplete="off"
                                           class="layui-input">
                                </div>
                            </div>
                            <!--<input class="disN" type="text" name="limit" value="10">-->
                            <!--<input class="disN" type="text" name="page" value="1">-->

                            <div class="layui-col-lg1 layui-col-md1">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="fbaOpLog_Search" lay-filter="fbaOpLog_Search">查询
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table lay-filter="fbaOpLog_table" class="layui-table" id="fbaOpLog_table"></table>
                    <table lay-filter="fbaOpLog_dashboard_table" class="layui-table" id="fbaOpLog_dashboard_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="fbaOpLog_userlog_table_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table lay-filter="fbaOpLog_userlog_table" class="layui-table" id="fbaOpLog_userlog_table"></table>
        </div>
    </div>
</script>

<script type="text/html" id="fbaOpLog_date_trans_tpl">
    {{ layui.laytpl.fbaOpLog_dealOpDay(d.opDay) }}
</script>

<script src="${ctx}/static/teafram/teaFram.js"></script>
<script src="${ctx}/static/js/warehouse/fbaOpLog.js"></script>


<script type="text/html" id="fba_warehousedashboard_completeNum_tpl">
    {{# if(d.completeNumStr != null ){ }}
    <div>{{d.completeNumStr}}</div>
    {{# }else if(d.showTodayHour ){ }}
    <div style="cursor: pointer;text-decoration: underline;text-decoration-color: #3064bb;}" class="fba_warehousedashboard_completeNum_hour fba_warehousedashboard_complete" title="点击查询今日时效" taskType="{{d.taskType}}" taskTypeName="{{d.taskTypeName}}" storeId="{{d.storeId}}">{{d.completeNum  }}
        {{# if(d.errorComplete != null ){ }}
        / {{ d.errorComplete }}
        {{# } }}
    </div>
    {{# }else{ }}
    <div class="fba_warehousedashboard_complete">{{d.completeNumStr || d.completeNum  }}</div>
    {{# } }}
</script>

<script type="text/html" id="fba_warehousedashboard_waitNum_tpl">
    {{# if(d.waitNumStr != null ){ }}
    <div>{{d.waitNumStr}}</div>
    {{# }else if(d.showDownloadIcon ){ }}
    <div title="下载待完成数据" class="fba_warehousedashboard_waitNum_hour fba_warehousedashboard_wait" >{{d.waitNum}}<i class="layui-icon fba_warehousedashboard_waitNum_download" taskType="{{d.taskType}}" taskTypeName="{{d.taskTypeName}}" storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div>
    {{# }else{ }}
    <div class="fba_warehousedashboard_wait">{{d.waitNumStr || d.waitNum  }}</div>
    {{# } }}
</script>

<script type="text/html" id="fba_warehousedashboard_highDays_tpl">
    <div title="{{d.highDays}}">{{d.highNumStr || d.highNum}} </div>
</script>

<script type="text/html" id="fba_warehousedashboard_lowerDays_tpl">
    <div title="{{d.lowerDays}}">{{d.lowerNumStr || d.lowerNum}}  </div>
</script>

<script type="text/html" id="fba_warehousedashboard_fourNum_tpl">
    <div>{{d.fourNum || '0' }} <span style="color: gray;">( {{fbaWareHouseGetPercent(d.fourNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%) </span> </div>
</script>
<script type="text/html" id="fba_warehousedashboard_thirdNum_tpl">
    <div>{{d.thirdNum || '0' }} <span style="color: gray;">( {{fbaWareHouseGetPercent(d.thirdNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%)</span> </div>
</script>

<script type="text/html" id="fba_warehousedashboard_secondNum_tpl">
    <div>{{d.secondNum || '0' }} <span style="color: gray;">( {{fbaWareHouseGetPercent(d.secondNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%)</span> </div>
</script>

<script type="text/html" id="fba_warehousedashboard_firstNum_tpl">
    <div>{{d.firstNum || '0' }} <span style="color: gray;">( {{fbaWareHouseGetPercent(d.firstNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%)</span> </div>
</script>

<script type="text/html" id="fba_warehousedashboard_completeNum_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="fba_warehousedashboard_completeNum_table" lay-filter="fba_warehousedashboard_completeNum_table"></table>
        </div>
    </div>
</script>