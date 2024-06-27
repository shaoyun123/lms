<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt修改欧盟责任人</title>
<style></style>
<div class="layui-fluid" id="LAY-smtUpdateMsrEuId">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-header disflex">
          <div class="w200 layui-form">
            <select
              id="smtUpdateMsrEuId_msrEuId"
              lay-search
              name="msrEuId"
            ></select>
          </div>
          <button
            type="reset"
            class="layui-btn layui-btn-sm ml20"
            id="smtUpdateMsrEuId_sync"
          >
            同步
          </button>
        </div>
        <div class="layui-card-body">
          <div class="disFCenter">
            <div>数量(<span id="smtUpdateMsrEuId_total"></span>)</div>
            <button
              type="reset"
              class="layui-btn layui-btn-sm layui-btn-danger"
              id="smtUpdateMsrEuId_update"
            >
              批量调整
            </button>
          </div>

          <table
            class="layui-table"
            id="smtUpdateMsrEuId_table"
            lay-filter="smtUpdateMsrEuId_table"
          ></table>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="smtUpdateMsrEuId_table_result_info">
  <div class="result"></div>
  <input
    type="text"
    name="{{'itemId_'+d.itemId}}"
    class="hidden"
    value="{{d.itemId}}"
  />
</script>

<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtUpdateMsrEuId.js"
></script>
