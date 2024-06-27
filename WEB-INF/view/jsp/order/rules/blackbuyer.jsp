<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>黑名单买家</title>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
      <div class="layui-col-lg12 layui-col-md12">
          <!-- 搜索条件 -->
          <div class="layui-card">
              <div class="layui-card-body">
                   <form class="layui-form" id="blackbuyerForm">
                      <div class="layui-form-item">
                          <div class="layui-col-lg4 layui-col-md4">
                              <label class="layui-form-label">创建时间</label>
                              <div class="layui-input-block">
                                <input type="text" class="layui-input" id="blackbuyer_times" name="times" readonly>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">买家ID</label>
                              <div class="layui-input-block">
                                <input type="text" class="layui-input" autocomplete="off" name="buyerIdList">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">创建人</label>
                              <div class="layui-input-block">
                                <select name="creatorIdList"
                                  id="blackbuyer_creatorIdList"
                                  xm-select="blackbuyer_creatorIdList"
                                  xm-select-search
                                  xm-select-search-type="dl"
                                  xm-select-skin="normal">
                            </select> 
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2" style="padding-left:5px;">
                              <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="blackbuyer_submit">查询</span>
                              <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
          <%-- 操作 --%>
          <div class="layui-card" id="blackbuyer_card">
            <div class="fixHigh">
              <div class="layui-card-header">
                  <div class="fixTab">
                      <!-- 页签点击结构 -->
                      <div class="layui-tab" lay-filter="blackbuyer_tabs" id="blackbuyer_tabs">
                          
                      </div>
                      <!-- 下面的div放按钮,结构不要变化 -->
                      <div>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="blackbuyer_downloadBtn">
                          下载模板
                        </span>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="blackbuyer_addTableBtn">
                            表格新增
                        </span>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="blackbuyer_addLayerBtn" style="margin-left: 5px;">
                          新增
                      </span>
                      </div>
                  </div>
              </div>
            </div>
            <!-- 下面放表格 -->
            <div class="layui-card-body">
                <table class="layui-table" lay-filter="blackbuyer_tableFilter" id="blackbuyer_table"></table>
            </div>
          </div>
      </div>
  </div>
</div>

<script type="text/html" id="blackbuyer_tableIdBar">
  <div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a></div>
</script>

<script type="text/html" id="blackbuyer_addLayer">
  <div style="padding: 20px 40px 0 20px;">
    <form class="layui-form">
      <div class="layui-form-item">
        <label class="layui-form-label"><font color="red">*</font>买家ID</label>
        <div class="layui-input-block">
          <input type="text" name="buyerId" required lay-verify="required" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">买家名称</label>
        <div class="layui-input-block">
          <input type="text" name="buyer" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">加入原因</label>
        <div class="layui-input-block">
          <textarea name="remark" class="layui-textarea"></textarea>
        </div>
      </div>
    </form>
  </div>
</script>

<script src="${ctx}/static/js/order/blackbuyer.js"></script>