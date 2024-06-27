<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>修改标题</title>
<style>
  #adjustPriceSearchForm .layui-form-item {
    margin-bottom: 0;
  }
  .dis_flex {
    display: flex;
    justify-content: space-between;
  }
  .w_70 {
    width: 70%;
  }
  #shopee_online_modifyDesc .layui-form-item .form-textarea {
    min-height: 80px;
  }
</style>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15" id="shopee_online_modifyDesc">
    <div class="layui-col-md12">
      <div class="layui-form-item">
        <div class="layui-col-lg2 layui-col-md2">
          <label
            class="layui-form-label"
            style="width: 40px; padding: 5px 10px 5px 5px"
            >原标题</label
          >
          <div class="layui-input-block" style="margin-left: 55px">
            <textarea
              class="layui-textarea form-textarea"
              name="shopee_old_string_title"
              id="shopee_old_string_title"
              placeholder="请输入需要替换词，为空将全量调整标题"
            ></textarea>
          </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <label class="layui-form-label">替换/修改为</label>
          <div class="layui-input-block">
            <textarea
              class="layui-textarea form-textarea"
              name="shopee_new_string_title"
              id="shopee_new_string_title"
              placeholder="请输入，可用下划线代替原标题在其前后增加，例如：_apple"
            ></textarea>
          </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <label class="layui-form-label">原描述</label>
          <div class="layui-input-block">
            <textarea
              class="layui-textarea form-textarea"
              name="shopee_old_string_desc"
              id="shopee_old_string_desc"
              placeholder="请输入需要替换词，为空将全量调整描述"
            ></textarea>
          </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <label class="layui-form-label">替换/修改为</label>
          <div class="layui-input-block">
            <textarea
              class="layui-textarea form-textarea"
              name="shopee_new_string_desc"
              id="shopee_new_string_desc"
              placeholder="请输入，可用下划线代替原描述在其前后增加，例如：_apple"
            ></textarea>
          </div>
        </div>
        <div class="layui-col-lg1 layui-col-md1">
          <button
            class="layui-btn layui-btn-normal layui-btn-sm"
            id="shopee_online_modifyDesc_apply_btn"
          >
            一键应用
          </button>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-header disFCenter">
          <div style="line-height: 30px">
            数量(<span id="tolnum_span_shopee_modifyTitle"></span>)
          </div>
          <div class="disflex">
            <input
              type="text"
              id="shop_modifyTitle_timing"
              class="layui-input"
            />
            <button
              class="layui-btn layui-btn-normal layui-btn-sm"
              id="shopee_online_modifyDesc_onTime_btn"
              lay-tips="选中商品将根据选择时间定时替换标题及描述"
            >
              定时替换
            </button>
            <button
              class="layui-btn layui-btn-normal layui-btn-sm"
              id="shopee_online_modifyDesc_new_title_btn"
              lay-tips="按照刊登时生成标题的规则重新生成"
            >
              重新生成标题
            </button>
            <button
              class="layui-btn layui-btn-normal layui-btn-sm"
              id="shopee_online_modifyDesc_new_desc_btn"
              lay-tips="按照刊登时生成描述的规则重新生成"
            >
              重新生成描述
            </button>
          </div>
        </div>
        <div class="layui-card-body">
          <!-- 表格的数据渲染 -->
          <table
            class="layui-table"
            id="modifyShopTitle_Table"
            lay-filter="modifyShopTitle_Table"
          ></table>
          <script type="text/html" id="new_describe">
            <textarea
              class="layui-textarea  descript_textarea"
              name="prodDesc"
              style="min-height:200px;"
              cols="40"
            >{{ d.prodDesc || '' }}</textarea
            >
          </script>
          <script type="text/html" id="new_shopTitle">
            <textarea
              class="layui-textarea ifFocusInput"
              name="title"
              style="min-height:100px;"
              cols="40"
              data-prodpid="{{d.prodPId}}"
            >{{ d.title || '' }}</textarea
            >
          </script>
        </div>
      </div>
    </div>
  </div>
</div>
<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/shopee/shopModifyMainTitle.js"
></script>
