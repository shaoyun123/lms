<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>仓管部日看板</title>
<style>
    #warehousedashboard_search_form .layui-form-label {
        padding: 0 !important;
        line-height: 31px !important;
    }

    #warehousedashboard_last_refresh_span {
        font-size: 16px;
        padding-left: 10px;
    }

    .warehousedashboard_search_time{
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form-item">
                        <input type="file" id="warehousedashboard_upload_btn" style="display: none;" />
                        <input type="hidden" id="warehousedashboard_upload_btn_storeId"/>
                        <div class="layui-col-md5 layui-col-lg5">
                            <h1 id="warehousedashboard_pageTitle">XXXX年X月X日仓管部看板</h1>
                            <permTag:perm funcCode="warehousedashboard_edit_target"> <span
                                    id="warehousedashboard_edit_target"> </span> </permTag:perm>
                            <div class="disflex mt20">
                                <div class="warehousedashboard_search_time w300">
                                    <div>已完成日期</div>
                                    <input class="layui-input w200" id="warehousedashboard_search_byDate" />
                                </div>
                                <div class="warehousedashboard_search_time w300">
                                    <div>仓库</div>
                                    <div class="layui-form">
                                        <select name="warehouse" id="warehousedashboard_warehouse"></select>
                                    </div>
                                </div>
                                <button type="button" class="layui-btn layui-btn-sm ml20" id="warehousedashboard_searchByDate">查询</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="warehousedashboard_card">
                <div class="layui-card-body">
                    <div class="layui-form-item">
                        <div class="layui-col-md8 layui-col-lg8" style="padding-right: 10px;">
                            <h2 id="warehousedashboard_data_table1_warehouseName" style="line-height: 40px;">仓库名</h2>
                            <div>
                                <table class="layui-table" id="warehousedashboard_data_table1"
                                    lay-filter='warehousedashboard_data_table1' style="margin: 0px;"></table>
                            </div>
                        </div>
                        <div class="layui-col-md4 layui-col-lg4" style="padding-right: 10px; margin-top: 40px;">
                            <table class="layui-table" id="warehousedashboard_data_table2"
                                lay-filter='warehousedashboard_data_table2' style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="warehousedashboard_targetNum_tpl">
    {{# if(d.showTarget ){ }}
        <div>{{d.targetNum || '' }}<i class="layui-icon layui-icon-edit" style="color: #009688" title="修改指标">&#xe642;</i></div>
    {{# }else{ }}
        <div></div>
    {{# } }}
</script>
<script type="text/html" id="warehousedashboard_completeNum_tpl">
    {{# if(d.completeNumStr != null ){ }}
        <div>{{d.completeNumStr}}</div>
    {{# }else if(d.showTodayHour ){ }}
        <div style="cursor: pointer;text-decoration: underline;text-decoration-color: #3064bb;}" class="warehousedashboard_completeNum_hour warehousedashboard_complete" title="点击查询今日时效" taskType="{{d.taskType}}" taskTypeName="{{d.taskTypeName}}" storeId="{{d.storeId}}">{{d.completeNum  }}
            {{# if(d.errorComplete != null ){ }}
            / {{ d.errorComplete }}
            {{# } }}
        </div>
    {{# if(d.taskType == 'baohuo' ){ }}
    <div title="下载超时数据" class="warehousedashboard_waitNum_hour " >
        <i class="layui-icon warehousedashboard_completeNum_download" taskType="packageMoreThanFifteen" taskTypeName="包装超过15小时"
           storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div> 
    {{# } }}
    {{# if(d.taskType == 'fenjiancheck' ){ }}
    <div title="下载超时数据" class="warehousedashboard_waitNum_hour " >
        <i class="layui-icon warehousedashboard_completeNum_download" taskType="pickUpMoreThanEightHours" taskTypeName="分拣核查超过15小时"
           storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div>
    {{# } }}
    {{# if(d.taskType == 'peihuo' ){ }}
    <div title="下载超时数据" class="warehousedashboard_waitNum_hour " >
        <i class="layui-icon warehousedashboard_completeNum_download" taskType="peihuoMoreThanFiveHours" taskTypeName="配货超过5小时"
           storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div>
    {{# } }}
    {{# if(d.taskType == 'hedanmuli' ){ }}
    <div title="下载超时数据" class="warehousedashboard_waitNum_hour " >
        <i class="layui-icon warehousedashboard_completeNum_download" taskType="multiHeidanMoreThanFiveHours" taskTypeName="多品核单超过5小时"
           storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div>
    {{# } }}
    {{# }else{ }}
        <div class="warehousedashboard_complete">{{d.completeNumStr || d.completeNum  }}</div>
    {{# } }}
</script>
<script type="text/html" id="warehousedashboard_waitNum_tpl">
    {{# if(d.waitNumStr != null ){ }}
            <div>{{d.waitNumStr}}</div>
    {{# }else if(d.showDownloadIcon ){ }}
            <div title="下载待完成数据" class="warehousedashboard_waitNum_hour warehousedashboard_wait" >{{d.waitNum}}<i class="layui-icon warehousedashboard_waitNum_download" taskType="{{d.taskType}}" taskTypeName="{{d.taskTypeName}}" storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div>
    {{# }else if(d.showOtherDownLoadIcon ){ }}
            <div title="{{ d.showOtherDownDescription }}" class="warehousedashboard_waitNum_hour warehousedashboard_wait" >{{d.waitNum}}<i class="layui-icon warehousedashboard_waitNum_download" taskType="{{d.taskType}}" taskTypeName="{{d.taskTypeName}}" storeId="{{d.storeId}}"   style="cursor:pointer; ">&nbsp; &#xe67c;</i></div>
    {{# }else{ }}
            <div class="warehousedashboard_wait">{{d.waitNumStr || d.waitNum  }}</div>
    {{# } }}
</script>
<script type="text/html" id="warehousedashboard_boardAndSku_tpl">
    {{# if(d.showDownloadIcon ){ }}
    <div title="下载sku数据" class="warehousedashboard_boardAndSku boardAndSku" >{{d.total}}<i class="layui-icon warehousedashboard_boardAndSku_download" taskType="{{d.taskType}}" taskTypeName="{{d.taskName}}"   style="cursor:pointer; ">&nbsp; &#xe601;</i></div>
    {{# }else{ }}
    <div class="warehousedashboard_boardAndSku">{{d.total}}</div>
    {{# } }}
</script>
<script type="text/html" id="warehousedashboard_firstNum_tpl">
    <div>{{d.firstNum || '0' }} <span style="color: gray;">( {{wareHouseGetPercent(d.firstNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%)</span> </div>
</script>
<script type="text/html" id="warehousedashboard_secondNum_tpl">
    <div>{{d.secondNum || '0' }} <span style="color: gray;">( {{wareHouseGetPercent(d.secondNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%)</span> </div>
</script>
<script type="text/html" id="warehousedashboard_thirdNum_tpl">
    <div>{{d.thirdNum || '0' }} <span style="color: gray;">( {{wareHouseGetPercent(d.thirdNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%)</span> </div>
</script>
<script type="text/html" id="warehousedashboard_fourNum_tpl">
    <div>{{d.fourNum || '0' }} <span style="color: gray;">( {{wareHouseGetPercent(d.fourNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%) </span> </div>
</script>
<script type="text/html" id="warehousedashboard_fiveNum_tpl">
    <div>{{d.fiveNum || '0' }} <span style="color: gray;">( {{wareHouseGetPercent(d.fiveNum,[d.firstNum,d.secondNum,d.thirdNum,d.fourNum,d.fiveNum]) }}%) </span> </div>
</script>
<script type="text/html" id="warehousedashboard_baoguo_tpl">
    <div>包裹数 </div>
</script>
<script type="text/html" id="warehousedashboard_sku_tpl">
    <div>SKU个数 </div>
</script>
<script type="text/html" id="warehousedashboard_highDays_tpl">
    <div title="{{d.highDays}}">{{d.highNumStr || d.highNum}} </div>
</script>
<script type="text/html" id="warehousedashboard_lowerDays_tpl">
    <div title="{{d.lowerDays}}">{{d.lowerNumStr || d.lowerNum}}  </div>
</script>
<script type="text/html" id="warehousedashboard_completeNum_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="warehousedashboard_completeNum_table" lay-filter="warehousedashboard_completeNum_table"></table>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/warehouse/warehousedashboard.js"></script>