<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>日志分析</title>
<style>
  .loganalyze-errMsg {
    cursor: pointer;
    color: #1e9fff;
  }
  #loganalyze_card .layui-table-body,
  #loganalyze_searchWhiteLayerId .layui-table-body {
    overflow: hidden;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form" id="loganalyze_searchForm">
                  <div class="layui-form-item">
                    <div class="layui-col-md2 layui-col-lg2">
                        <div class="layui-form-label">日志时间</div>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="loganalyze_times" name="times" readonly>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">首行错误代码</label>
                        <div class="layui-input-block">
                          <input type="text" class="layui-input" name="errorCodeMsg" placeholder="模糊查询">
                        </div>
                    </div>
                    <input type="hidden" name="dealStatus" value="false">
                    <div class="layui-col-md2 layui-col-lg2" style="margin-left: 15px;">
                      <span class="layui-btn layui-btn-sm layui-btn-normal" lay-filter="loganalyzeSearch_submit" lay-submit>查询</span>
                      <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button> 
                    </div>
                  </div>
                </form>
            </div>
        </div>
        <div class="layui-card" id="loganalyze_card">
          <div class="fixHigh">
            <div class="layui-card-header">
                <div class="fixTab">
                    <!-- 页签点击结构 -->
                    <div class="layui-tab" lay-filter="loganalyze_tabs" id="loganalyze_tabs">
                        <ul class="layui-tab-title">
                            <li class="layui-this">未处理<span id="loganalyze_count1"></span></li>
                            <li>已处理<span id="loganalyze_count2"></span></li>
                        </ul>
                    </div>
                    <!-- 下面的div放按钮,结构不要变化 -->
                    <div>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="loganalyze_batchBtn">
                            批量处理
                        </span>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="loganalyze_setWhiteBtn">
                          设为白名单
                        </span>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="loganalyze_searchWhiteBtn">
                            查询白名单
                        </span>
                    </div>
                </div>
            </div>
          </div>
          <!-- 下面放表格 -->
          <div class="layui-card-body">
              <table class="layui-table" lay-filter="loganalyze_tableFilter" id="loganalyze_table"></table>
          </div>
        </div>
    </div>
  </div>
</div>

<script type="text/html" id="loganalyze_tableTime">
  <div class="alignLeft">
    <div><span style="color:#999">创建: </span>{{ Format( d.createTime, "yyyy-MM-dd")}}</div>
    <div><span style="color:#999">日志: </span>{{ Format( d.analyzeDate, "yyyy-MM-dd")}}</div>
    {{# if(d.dealStatus){ }}
    <div><span style="color:#999">处理: </span>{{ Format( d.dealTime, "yyyy-MM-dd")}}</div>
    {{# } }}
  </div>
</script>

<script type="text/html" id="loganalyze_errorCodeMsg">
  <div class="alignLeft">
    <span lay-event="errMsg" class="loganalyze-errMsg">{{d.errorCodeMsg || ''}}</span>
  </div>
</script>

<script type="text/html" id="loganalyze_searchWhiteLayer">
  <div style="padding:20px;">
    <table class="layui-table" lay-filter="loganalyze_searchWhiteTableFilter" id="loganalyze_searchWhiteTable"></table>
  </div>
</script>

<script type="text/html" id="loganalyze_setWhiteLayer">
  <div style="padding:20px 20px 0 0;">
    <form class="layui-form">
      <div class="layui-form-item">
        <div class="layui-form-label">过期时间</div>
        <div class="layui-input-block">
            <input type="text" class="layui-input" id="loganalyze_expireTime" name="expireTime" readonly>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-form-label">备注</div>
        <div class="layui-input-block">
          <textarea name="remark" class="layui-textarea"></textarea>
        </div>
      </div>
    </form>
  </div>
</script>


<script type="text/javascript" src="${ctx}/static/js/configuration/staff/loganalyze.js?v=${ver}"></script>