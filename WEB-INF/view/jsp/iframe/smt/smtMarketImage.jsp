<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt 批量修改营销图</title>
<style>
  #LAY_smtMarketimage .marketImage img {
    display: block;
  }
  #LAY_smtMarketimage .smtMarketimage_table_uploadLocal_btn a {
    color: #fff;
    height: 22px;
    line-height: 22px;
    padding: 0;
  }
  #LAY_smtMarketimage .marketImage .uploadify-queue-item {
    display: none;
  }
  #LAY_smtMarketimage .marketImage .marketImage1 {
    width: 150px;
    height: 200px;
  }
  #LAY_smtMarketimage .marketImage .marketImage2 {
    width: 150px;
    height: 150px;
  }
</style>
<div class="layui-fluid" id="LAY_smtMarketimage">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="disFCenter">
            <div>总数(<span id="smtMarketimage_total"></span>)</div>
            <div class="w200"></div>
            <el-button
              class="layui-btn layui-btn-sm"
              id="smtMarketimage_whiteBgImage_btn"
              >自动填充白底图</el-button
            >
            <el-button
              class="layui-btn layui-btn-sm"
              id="smtMarketimage_sceneImage_btn"
              >自动填充场景图</el-button
            >
            <el-button
              class="layui-btn layui-btn-sm layui-btn-normal"
              id="smtMarketimage_batchUpdate_btn"
              >批量修改</el-button
            >
          </div>
          <table
            id="smtMarketimage_table"
            lay-filter="smtMarketimage_table"
            class="layui-table"
          ></table>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="smtMarketimage_table_guideImage_tpl">
  {{# layui.each(d.mainImages, function(_, imageUrl){ }}
  <img src="{{imageUrl}}" class="imgCss img_show_hide" />
  {{# }) }}
</script>
<script type="text/html" id="smtMarketimage_table_marketImage_tpl">
  <input
    type="text"
    class="hidden"
    name="storeAcctId"
    value="{{d.storeAcctId}}"
  />
  <div class="disFCenter">
    {{# layui.each(d.marketImageList, function(_, item){ }}
    <div class="disflex marketImage" data-prodpids="{{d.prodPIds}}">
      <div>
        <span class="layui-bg-red">说明!</span>
        <span>{{item.proportionNote}}</span>
        <span class="fRed">{{item.note}}</span>
        <img
          src="{{item.url}}"
          class="imgCss img_show_hide marketImage{{item.imageType}}"
        />
      </div>
      <div class="ml10">
        <a
          class="layui-btn layui-btn-xs smtMarketimage_table_uploadLocal_btn"
          data-imagetype="{{item.imageType}}"
          >本地图片</a
        >
        <br />
        <a
          class="layui-btn layui-btn-xs smtMarketimage_table_uploadNet_btn"
          data-imagetype="{{item.imageType}}"
          >网络图片</a
        >
        <br />
        <a
          class="layui-btn layui-btn-xs smtMarketimage_table_uploadTpl_btn"
          data-imagetype="{{item.imageType}}"
          >模板图片</a
        >
        <br />
        {{# if(item.imageType ==2 ){ }}
        <a
          class="layui-btn layui-btn-xs smtMarketimage_table_matting_btn"
          data-imagetype="{{item.imageType}}"
          >抠图</a
        >
        {{# } }}
      </div>
    </div>
    {{# }) }}
  </div>
</script>
<script
  type="text/javascript"
  src="${ctx}/static/Huploadify/jquery.Huploadify.js"
></script>
<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtMarketImage.js"
></script>
