<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>收件人</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="addressee_searchForm" lay-filter="addressee_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="buyerName" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-inline">
                                   <select name="storeId">
                                       <option></option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="addressee_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="position:absolute; top:15px; right: 10px;">
                       <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="addressee_newAdd">新增</button>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="addressee_table"  lay-filter="addressee_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 是否默认 --%>
<script type="text/html" id="addressee_isDefault">
    <div>
    {{# if(d.ifDefault){ }}
        <input type="checkbox" checked lay-skin="primary" disabled>
    {{# }else{ }}
        <input type="checkbox" lay-skin="primary" disabled>
        {{# } }}
    </div>
</script>
<%-- 操作按钮 --%>
<script type="text/html" id="addressee_tableIdBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>

<%-- 新增收件人 --%>
<script type="text/html" id="addressee_newAddLayer">
   <div class="p20" id="addressee_newAddLayer_form">
   </div>
</script>
<%-- 新增收件人模板 --%>
<script type="text/html" id="addressee_newAddLayer_formTpl">
        <form class="layui-form" id="addressee_editOrAddForm" lay-filter="addressee_editOrAddForm">
            {{# if(d.id){ }}
                <input type="hidden" name="id" value="{{d.id}}">
            {{# } }}
            <div class="layui-form-item">
                <label class="layui-form-label">采购员</label>
                <div class="layui-input-block">
                    <select name="buyerId" lay-verify="required" lay-search>
                        <option value="">请选择</option>
                    {{# if(d.buyerArr){ }}
                    {{#  layui.each(d.buyerArr, function(index, item){ }}
                    {{# if(item.id == d.buyerId){  }}
                        <option value="{{item.id}}" selected>{{item.userName}}</option>
                    {{# }else{  }}
                        <option value="{{item.id}}">{{item.userName}}</option>
                    {{# } }}
                    {{#  }); }}
                    {{# } }}
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"> 仓库</label>
                <div class="layui-input-block">
                    <select name="storeId" lay-verify="required" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">收件人</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" value="{{d.receiver}}" style="width:85%;" name="receiver" lay-verify="required">
                    <div style="position:absolute;top:0px;right:-10px;">
                        {{# if(d.ifDefault){  }}
                        <input type="checkbox" name="isDefault" lay-skin="primary" title="设为默认" checked="">
                        {{# }else{ }}
                        <input type="checkbox" name="isDefault" lay-skin="primary" title="设为默认">
                        {{# } }}
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">手机号</label>
                <div class="layui-input-block">
                    <input type="tel" class="layui-input" value="{{d.phone}}" name="phone" lay-verify="required" maxlength="11">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">收件地址</label>
                <div class="layui-input-block">
                    {{# if(!d.id){  }}
                    <select name="addressId" lay-verify="required" lay-search>
                        <option value="">请选择</option>
                    {{# if(d.addressArr){ }}
                    {{#  layui.each(d.addressArr, function(index, item){ }}
                    {{# if(item.id == d.addressId){  }}
                        <option value="{{item.id}}" selected>{{item.addressName}}</option>
                    {{# }else{  }}
                        <option value="{{item.id}}">{{item.addressName}}</option>
                    {{# } }}
                    {{#  }); }}
                    {{# } }}
                    </select>
                    {{# }else{  }}
                    <select name="addressId" disabled>
                        <option value="{{d.addressId}}">{{d.purAddress}}</option>
                    </select>
                    {{# } }}
                </div>
            </div>
            <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="addressee_formTpl_submit">查询</span>
        </form>
</script>


<script src="${ctx}/static/js/warehouse/addressee.js"></script>