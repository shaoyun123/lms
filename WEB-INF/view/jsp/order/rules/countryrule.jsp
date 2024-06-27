<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>法属国规则</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 表格-->
            <div class="layui-card">
                <div class="layui-card-header" style="display:flex;justify-content: flex-end;align-items: center;">
                    <a class="layui-btn layui-btn-sm" id="countryrule_newAdd">新增映射国家/地区</a>
                </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="countryrule_table" lay-filter="countryrule_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 操作栏 --%>
<script type="text/html" id="countryrule_tableIdBar">
    <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
</script>

<%-- 新增/修改弹框 --%>
<script type="text/html" id="countryrule_add_edit">
    <div id="countryrule_add_edit_container"></div>
</script>

<script type="text/html" id="countryrule_add_edit_tpl">
    <div class="layui-form" style="padding: 20px 40px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">邮编前三位</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.postCodePrefix}}" name="postCodePrefix" id="countryrule_add_edit_postCodePrefix">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">映射国家/地区</label>
            <div class="layui-input-block">
                <select name="countryCode" id="countryrule_add_edit_countryCode">
                   <option value=""></option>
                   {{# if(d.listCountry){ }}
                      {{#  layui.each(d.listCountry, function(index, item){ }}
                        {{# if(d.countryCode == item.code){ }}
                        <option value="{{item.code}}" selected>{{item.name}}</option>
                        {{# }else{ }}
                        <option value="{{item.code}}">{{item.name}}</option>
                        {{# } }}
                      {{# }) }}
                   {{# } }}
                </select>
            </div>
        </div> 
    </div>
</script>



<script src="${ctx}/static/js/order/countryrule.js"></script>