<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>收货地址</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <div style="position: absolute;right:20px;"> 
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="receiveAddress_newAdd">新增</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="receiveAddress_table"  lay-filter="receiveAddress_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 是否默认 --%>
<script type="text/html" id="receiveAddress_isDefault">
    <div>
    {{# if(d.ifDefault){ }}
        <span>是</span>
    {{# }else{ }}
        <span>否</span>
    {{# } }}
    </div>
</script>
<%-- 操作按钮 --%>
<script type="text/html" id="receiveAddress_tableIdBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>

<%-- 新增+编辑功能(容器) --%>
<script type="text/html" id="receiveAddress_newAddLayer">
  <div class="p20" id="receiveAddress_newAddLayer_form">
  </div>
</script>
<%-- 新增+编辑功能(模板) --%>
<script type="text/html" id="receiveAddress_newAddLayer_formTpl">
    <form class="layui-form" id="receiveAddress_newAddLayerForm" lay-filter="receiveAddress_newAddLayerForm">
       {{# if(d.id){ }}
        <input type="hidden" name="id" value="{{d.id}}">
        {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label">地址名称</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.addressName}}" style="width:85%;" name="addressName">
                <div style="position:absolute;top:0px;right:-10px;">
                    {{# if(d.ifDefault){  }}
                    <input type="checkbox" name="isDefault" lay-skin="primary" title="设为默认" checked>
                    {{# }else{ }}
                    <input type="checkbox" name="isDefault" lay-skin="primary" title="设为默认">
                    {{# } }}
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">仓库</label>
            <div class="layui-input-block">
                <select name="storeId" lay-filter="receiveAddress_storeIdSel">
                    <option></option>
                {{# if(d.storeArr){  }}
                    {{#  layui.each(d.storeArr, function(index, item){ }}
                    {{# if(d.storeId == item.id){  }}
                    <option value="{{item.id}}" selected>{{item.warehouseName}}</option>
                    {{# }else{ }}
                    <option value="{{item.id}}">{{item.warehouseName}}</option>
                    {{# } }}
                    {{#  }) }}
                {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">详细地址</label>
            <div class="layui-input-inline" style="width:152px;">
               <input type="text" class="layui-input" placeholder="省" name="province" value="{{d.province}}">
            </div>
            <div class="layui-input-inline" style="width:152px;">
               <input type="text" class="layui-input" placeholder="市" name="city" value="{{d.city}}">
            </div>
            <div class="layui-input-inline" style="width:152px;">
               <input type="text" class="layui-input" placeholder="区" name="district" value="{{d.district}}">
            </div>
            <div class="layui-input-inline" style="width:152px;">
               <input type="text" class="layui-input" placeholder="街道" name="street" value="{{d.street}}">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <input type="text" class="layui-input" placeholder="详细地址" name="detail" value="{{d.detail}}">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">匹配库位前缀</label>
            <div class="layui-input-block">
                {{# if(d.charNumArr){  }}
                    {{#  layui.each(d.charNumArr, function(index, item){ }}
                    {{# if(d.stockLocationPrefix.indexOf(item.key)>-1){ }}
                    <input type="checkbox" name="receiveAddress_{{item.key}}" lay-skin="primary" title="{{item.value}}" checked>
                    {{# }else{ }}
                    <input type="checkbox" name="receiveAddress_{{item.key}}" lay-skin="primary" title="{{item.value}}">
                    {{# } }}
                    {{#  }) }}
                {{# } }}
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">匹配楼栋</label>
            <div class="layui-input-block layui-form" id="receiveAddress_buildingNosContains"  lay-filter="receiveAddress_buildingNosContains">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">匹配类目</label>
            <div class="layui-input-block">
                <select name="addressCateIdList" id="purAddressCateIdList" xm-select="receiveAddress_purAddressCateIdList" lay-filter="receiveAddress_purAddressCateIdList"
                xm-select-search="" xm-select-search-type="dl" xm-select-skin="normal">
                </select>
            </div>
        </div>
        <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="receiveAddress_formTpl_submit">查询</span>
    </form>
</script>


<script src="${ctx}/static/js/warehouse/receiveAddress.js"></script>