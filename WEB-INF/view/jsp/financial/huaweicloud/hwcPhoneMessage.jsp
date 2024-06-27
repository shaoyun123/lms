<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<title>消息</title>
<div class="layui-fluid">
    <div class="layui-col-space15">
       <div class="layui-card" style="margin-top: 10px">
          <div class="layui-card-body">
            <form action="" class="layui-form" id="hwcPhoneMessageSearchForm">
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">虚拟号码</label>
                    <div class="layui-input-block">
                        <input type="text" name="virtualPhone" placeholder="单个精确查询" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">发送端</label>
                    <div class="layui-input-block">
                        <input type="text" name="fromPhone" placeholder="单个精确查询" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">接收端</label>
                    <div class="layui-input-block">
                        <input type="text" name="toPhone" placeholder="单个精确查询" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">时间</label>
                    <div class="layui-input-block">
                        <input id="hwcPhoneMessageSearchForm_timeSection" name="timeSection" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <div class="layui-input-inline">
                        <button type="button" class="layui-btn layui-btn-sm ml20 keyHandle" data-type="reload" id="hwcPhoneMessageSearch">搜索</button>
                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                    </div>
                </div>
            </form>
            <div class="poab">
                <div class="layui-inline">
                    <div class="layui-input-inline">
                    </div>
                </div>
            </div>
          </div>
       </div>
       <div class="layui-card" id="hwcPhoneMessageCard">
          <div class="layui-card-body">
             <table class="layui-table" id="hwcPhoneMessageTable" lay-filter="hwcPhoneMessageTable"></table>
          </div>
       </div>
    </div>
</div>

<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="hwcPhoneMessage_ifReadTpl">
    {{# if (d.ifRead) {}}
    <div><input type="checkbox" lay-skin="primary" checked disabled></div>
    {{#}}}
    {{# if (!d.ifRead) {}}
    <div><input type="checkbox" lay-skin="primary" disabled></div>
    {{#}}}
</script>



<script type="text/javascript" src="${ctx}/static/js/financial/huaweicloud/hwcPhoneMessage.js"></script>


