<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>海外仓仓库</title>

<style>
#wyt_warehouse_editOrAddLayerId {
    overflow: visible;
}
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <div style="display:flex;justify-content:flex-end;align-items:center;height: 100%;">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="warehouse_addWarehouseBtn">新增</span>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="wyt_warehouse_table"  lay-filter="wyt_warehouse_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 表格-服务商类型 --%>
<script type="text/html" id="wyt_warehouse_serviceType">
    <div>
        {{# if(d.serviceType == 1){ }}
        <span>万邑通</span>
        {{#  }else if(d.serviceType==2){ }}
        <span>谷仓</span>
        {{# }else if(d.serviceType==3){ }}
        <span>递四方</span>
        {{# }  }}
    </div>
</script>

<%-- 操作 --%>
<script type="text/html" id="wyt_warehouse_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span>
        {{#　if(d.status){　}}
        <span class="layui-btn layui-btn-xs" lay-event="enable">停用</span>
        {{# }else{ }}
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="disable">启用</span>
        {{# } }}
    </div>
</script>

<%-- 新增/修改弹框 --%>
<script type="text/html" id="wyt_warehouse_editOrAddLayer">
    <div class="p20" id="wyt_warehouse_editOrAddContainer"></div>
</script>
<script type="text/html" id="wyt_warehouse_editOrAddContainerTpl">
    <div class="layui-form">
        {{# if(d.id){ }}
        <input type="hidden" value="{{d.id}}">
        {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label">仓库名</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.name}}" name="name">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">仓库ID</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.winitWarehouseId || ''}}" name="winitWarehouseId">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">仓库编码</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.code}}" name="code">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">匹配销售渠道</label>
            <div class="layui-input-block">
                <select name="channel">
                    {{#  layui.each(d.channelArr, function(index, item){ }}
                        {{# if(item.channelCode == d.channel){ }}
                        <option value="{{item.channelCode}}" selected>{{item.channelName}}</option>
                        {{# }else{ }}
                        <option value="{{item.channelCode}}">{{item.channelName}}</option>
                        {{# } }}
                    {{# }) }}
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">服务商类型</label>
            <div class="layui-input-block">
                <select name="serviceType">
                    {{# if(d.serviceType == 2){ }}
                    <option value="1">万邑通</option>
                    <option value="2" selected>谷仓</option>
                    <option value="3">递四方</option>
                    {{#  }else if(d.serviceType == 3){ }}
                    <option value="1">万邑通</option>
                    <option value="2">谷仓</option>
                    <option value="3" selected>递四方</option>
                    {{# }else{ }}
                    <option value="1" selected>万邑通</option>
                    <option value="2">谷仓</option>
                    <option value="3">递四方</option>
                    {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">对应OA仓库</label>
            <div class="layui-input-block">
                <select name="warehouse">
                    {{#  layui.each(d.warehouseArr, function(index, item){ }}
                        {{# if(item.id == d.warehouseId){ }}
                        <option value="{{item.id}}" selected>{{item.warehouseName}}</option>
                        {{# }else{ }}
                        <option value="{{item.id}}">{{item.warehouseName}}</option>
                        {{# } }}
                    {{# }) }}
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">仓库币种</label>
            <div class="layui-input-block">
                <select name="currency">
                    <option value="">请选择</option>
                    {{#  layui.each(d.currencyArr, function(index, item){ }}
                    {{# if(item.dValue == d.currency){ }}
                    <option value="{{item.dValue}}" selected>{{item.dKey}}</option>
                    {{# }else{ }}
                    <option value="{{item.dValue}}">{{item.dKey}}</option>
                    {{# } }}
                    {{# }) }}
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">收件人</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.recipient || ''}}" name="recipient">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">电话号码</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.mobile || ''}}" name="mobile">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">地址</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.address || ''}}" name="address">
            </div>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/wyt/config/warehouse.js"></script>