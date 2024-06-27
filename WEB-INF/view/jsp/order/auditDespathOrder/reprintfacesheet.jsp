<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>补打面单</title>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
      <div class="layui-col-lg12 layui-col-md12">
          <div class="layui-card">
              <div class="layui-card-body">
                  <form class="layui-form" id="reprintfacesheetForm">
                      <div class="layui-form-item">
                          <div class="layui-col-md4 layui-col-lg4">
                              <label class="layui-form-label">面单补打时间</label>
                              <div class="layui-input-block">
                                  <input type="text" class="layui-input" id="reprintfacesheet_time" name="sheetTime" readonly>
                              </div>
                          </div>
                          <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">包装人</label>
                              <div class="layui-input-block">
                                  <select name="packingUserId" id="reprintfacesheet_packingUserId" lay-search></select>
                              </div>
                          </div>
                          
                          <div class="layui-col-md2 layui-col-lg2">
                            <div class="layui-input-block">
                              <span class="layui-btn layui-btn-sm layui-btn-normal" lay-filter="reprintfacesheetSearch" lay-submit>查询</span>
                              <span class="layui-btn layui-btn-sm" id="reprintfacesheetExport">导出</span>
                            </div>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
          <div class="layui-card" id="reprintfacesheetCard">
              <div class="layui-card-header" style="display: flex;align-items: center;justify-content: flex-end;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="reprintfacesheet_printBtn">补打面单</span>   
              </div>
              <!-- 下面放表格 -->
              <div class="layui-card-body">
                  <table class="layui-table" id="reprintfacesheet_table"></table>
              </div>
          </div>
      </div>
  </div>
</div>
<!-- 补打面单弹框 -->
<script type="text/html" id="reprintfacesheet_printLayer">
  <div style="padding:20px;">
    <div class="layui-form-item">
      <label class="layui-form-label" style="width: 90px;">订单号/跟踪号</label>
      <div class="layui-input-block" style="margin-left: 120px;">
          <input type="text" class="layui-input" name="reprintNo">
      </div>
    </div>
    <div>
      <table class="layui-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>订单号</th>
            <th>店铺单号</th>
            <th>跟踪号</th>
            <th>物流方式</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  </div>
</script>
<script src="${ctx}/static/js/order/reprintfacesheet.js"></script>
<script src="${ctx}/static/js/ireport/print.js"></script>