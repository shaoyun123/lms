<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>修改标题</title>
<!-- 参考tikotk在线商品的批量修改标题 -->
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
        <div class="layui-col-lg4 layui-col-md4">
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
        <div class="layui-col-lg4 layui-col-md4">
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
        <div class="layui-col-lg4 layui-col-md4">
          <button
            class="layui-btn layui-btn-normal layui-btn-sm ml10"
            id="shopee_online_modifyDesc_apply_btn"
          >
            一键应用
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
            id="shopee_online_modifyDesc_onTime_btn"
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
        <div class="layui-card-body">
          <!-- 表格的数据渲染 -->
          <table
            class="layui-table"
            id="modifyShopTitle_Table"
            lay-filter="modifyShopTitle_Table"
          ></table>
          <script type="text/html" id="old_shopTitle">
            <div
              class="oldTitle"
              style="{{d.isMuchWords ?'display:inline-table':''}}"
              data-title="{{d.title}}"
            >
              {{#if(!d.isMuchWords){ }}
              {{#layui.each(d._titleMuchList,function(index,item){ }}
              {{#if(item.endWithSymbol){ }}
              <span class="{{item.isHighLight ? 'fGreen' : ''}}"
                >{{ item.label.substring(0, item.label.length - 2) }}</span
              >
              <span>{{ item.label.substr(-2) }} </span>
              {{#}else{ }}
              <span class="{{item.isHighLight ? 'fGreen' : ''}}"
                >{{ item.label }}</span
              >
              {{#} }} {{# }) }} {{#}else{ }}
              {{#layui.each(d._titleList,function(index,item){ }}
              <span class="{{item.isHighLight ? 'fGreen' : ''}}"
                >{{ item.label }}</span
              >
              {{#}) }} {{#} }}
            </div>
          </script>
          <script type="text/html" id="new_shopTitle">
            <textarea
              class="layui-textarea ifFocusInput"
              name="title"
              style="min-height:100px;"
              cols="40"
              data-prodpid="{{d.prodPId}}"
              data-storeacctid="{{d.storeAcctId}}"
              data-itemid="{{d.itemId}}"
              data-oldtitle="{{d.title}}"
            >
{{ d.title || '' }}</textarea
            >
          </script>
        </div>
      </div>
    </div>
  </div>
</div>
<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/shopee/shopModifyTitle.js"
></script>
