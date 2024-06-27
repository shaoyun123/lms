<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>创建SBS商品</title>
<style>
  #shop_create_sbsItems_page .text-height {
    line-height: 20px;
  }
</style>
<div class="layui-fluid" id="shop_create_sbsItems_page">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-header disFCenter">
          <div>数量(<span id="shop_create_sbsItems_total">0</span>)</div>
          <div>!多个一卖的SBS商品不能映射原商品SKU，需新建一个组合品SKU来映射!</div>
          <div><a href="javascript:void(0);" class="layui-btn layui-btn-sm layui-btn-normal" id="shop_create_sbsItems_create">创建SBS商品</a></div>
        </div>
        <div class="layui-card-body">
          <table class="layui-table" id="shop_create_sbsItems_table" lay-filter="shop_create_sbsItems_table"></table>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/createSbsItems.js"></script>
