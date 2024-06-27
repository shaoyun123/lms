<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>物流税号</title>
<div class="layui-card">
    <div class="layui-card-header" style="padding: 20px 15px 0;">
      <button class="layui-btn layui-btn-sm" style="float: right;" id="logisticsTaxID_add">新增</button>
    </div>
    <div class="layui-card-body">
        <table id="logisticsTaxID_Table" lay-filter="logisticsTaxID_Table"></table>
    </div>
</div>
<script type="text/html" id="logisticsTaxID_Table_operate">
    <span class="layui-btn layui-btn-xs" lay-event="revise">修改</span>
    <!-- <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="remove">删除</span> -->
</script>
<script type="text/html" id="logisticsTaxID_Table_revise">
    <div class="layui-card-body">
        <form class="layui-form" id="logisticsTaxID_Table_reviseForm">
            <input type="hidden" name="id" disabled class="layui-input">
            <div class="layui-form-item">
              <label class="layui-form-label">平台</label>
              <div class="layui-input-block">
                <%--<input type="text" name="platCode" lay-verify="required" class="layui-input">--%>
                  <select name="platCode" lay-verify="required"></select>
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">英国税号</label>
              <div class="layui-input-block">
                <input type="text" name="englandIoss" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">欧盟EROI税号</label>
              <div class="layui-input-block">
               <input type="text" name="euEroi" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">欧盟IOSS税号</label>
              <div class="layui-input-block">
                <input type="text" name="euIoss" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">巴西税号</label>
              <div class="layui-input-block">
                <input type="text" name="brazilIoss" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">挪威税号</label>
              <div class="layui-input-block">
                <input type="text" name="norwayIoss" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">马来西亚税号</label>
              <div class="layui-input-block">
                <input type="text" name="myIoss" class="layui-input">
              </div>
            </div>
            <button style="display: none;" lay-submit id="logisticsTaxID_Table_reviseForm_submit" lay-filter="logisticsTaxID_Table_reviseForm_submit">提交</button>
          </form>
    
    </div>
</script>
<script src="${ctx}/static/js/logistics/logisticsTaxNumber.js"></script>