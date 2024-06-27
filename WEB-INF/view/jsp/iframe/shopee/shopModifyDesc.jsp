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
  #shopee_online_modifyDesc_editor .w-e-toolbar{
    flex-wrap: wrap;
  }
  #shopee_online_modifyDesc tbody tr.curClick{
    background-color: #e6f7ff;
  }
  #shopee_online_modifyDesc tbody tr.curClick.layui-table-hover{
    background-color: #d7effb;
  }
  #shopee_online_modifyDesc_editor{
    white-space: pre-line;
  }
</style>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15" id="shopee_online_modifyDesc">
    <div class="layui-col-md12">
      <div class="layui-form-item">
        <div class="layui-col-lg4 layui-col-md4">
          <label class="layui-form-label">原描述</label>
          <div class="layui-input-block">
            <textarea
              class="layui-textarea form-textarea"
              name="shopee_old_string_desc"
              id="shopee_old_string_desc"
              placeholder="请输入需要替换词"
            ></textarea>
          </div>
        </div>
        <div class="layui-col-lg4 layui-col-md4">
          <label class="layui-form-label">替换/修改为</label>
          <div class="layui-input-block">
            <textarea
              class="layui-textarea form-textarea"
              name="shopee_new_string_desc"
              id="shopee_new_string_desc"
              placeholder="请输入"
            ></textarea>
          </div>
        </div>
        <div class="layui-col-lg4 layui-col-md4">
          <button
            class="layui-btn layui-btn-normal layui-btn-sm ml10"
            id="shopee_online_modifyDesc_apply_btn"
          >
            一键应用
          </button>
          <button
            class="layui-btn layui-btn-normal layui-btn-sm"
            id="shopee_online_modifyDesc_new_desc_btn"
            lay-tips="按照刊登时生成描述的规则重新生成"
          >
            重新生成描述
          </button>
          <button
            class="layui-btn layui-btn-normal layui-btn-sm"
            id="shopee_online_modifyDesc_modify_btn"
          >
            提交
          </button>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-header disFCenter">
          <div style="line-height: 30px">
            数量(<span id="tolnum_span_shopee_modifyTitle"></span>)
          </div>
        </div>
        <div class="layui-card-body disflex">
          <!-- 表格的数据渲染 -->
          <div style="width: 450px;flex:none">
            <table
              class="layui-table"
              id="modifyShopDesc_Table"
              lay-filter="modifyShopDesc_Table"
            ></table>
          </div>
          <div id="shopee_online_modifyDesc_editor" style="margin: 10px 0 5px 5px;width: 100%;"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/html" id="shopee_online_modifyDesc_tr">
  <div
    class="info"
    data-itemid="{{d.itemId}}"
    data-prodpid="{{d.prodPId}}"
  >
    {{d.itemId}}
  </div>
</script>
<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/shopee/shopModifyDesc.js"
></script>
<!-- 富文本 -->
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
