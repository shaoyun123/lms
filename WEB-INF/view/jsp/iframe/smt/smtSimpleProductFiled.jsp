<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt批量修改备货期</title>
<!-- <link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" /> -->
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>
<style></style>

<div class="layui-fluid" id="smtSimpleProductFiled_modal">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">
        <div class="disFCenter layui-card-header">
          <div class="numCount" style="text-align: center; padding: 0 5px">
            数量(共<span id="smtSimpleProductFiled_modal_total">0</span>条)
          </div>
          <div>
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm"
              id="smtSimpleProductFiled_batch_adjust"
              >批量调整</a
            >
          </div>
        </div>
        <div class="layui-card-body">
          <!-- 表格的数据渲染 -->
          <table
            class="layui-table"
            id="smtSimpleProductFiled_Table"
            lay-filter="smtSimpleProductFiled_Table"
          ></table>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="smtSimpleProductFiled_Table_store-input">
  <div>{{d.storeAcct}}</div>
  <input
    class="layui-input hidden"
    name="storeAcctId"
    value="{{d.storeAcctId}}"
  />
  <input class="layui-input hidden" name="id" value="{{d.id}}" />
  <input class="layui-input hidden" name="itemId" value="{{d.itemId}}" />
  <input
    class="layui-input hidden"
    name="deliveryTime"
    value="{{d.deliveryTime}}"
  />
</script>

<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtSimpleProductFiled.js"
></script>
