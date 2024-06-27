<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>商品管理</title>

<style>
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                  <form class="layui-form" id="productinfoSearchForm">
                    <div class="layui-form-item">
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">货主</label>
                          <div class="layui-input-block">
                              <select name="ownerUserId" 
                              lay-search 
                              id="productinfo_ownerUserId"
                              lay-filter="productinfo_ownerUserId"
                              >
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">SKU</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="exactProdSSkus">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">商品ID</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="itemId">
                          </div>
                      </div>
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">回传状态</label>
                          <div class="layui-input-block">
                            <select name="confirmStatus" lay-search>
                              <option value="">全部</option>
                              <option value="1">已回传</option>
                              <option value="0">未回传</option>
                            </select>
                          </div>
                      </div>
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">SKU映射</label>
                          <div class="layui-input-block">
                            <select name="skuMappingStatus" lay-search>
                              <option value="">全部</option>
                              <option value="1">已映射</option>
                              <option value="0">未映射</option>
                            </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2" style="padding-left:2%;">
                        <span class="layui-btn layui-btn-sm" lay-filter="productinfoSearch"  lay-submit>
                        查询
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
            </div>
            <div class="layui-card">
              <div class="layui-card-header" style="text-align:right;">
                <div>
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="productinfo_export">导出</span>
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="productinfo_echo">回传商品信息</span>
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="productinfo_del">作废商品</span>
                </div>
              </div>
              <div class="layui-card-body">
                <table class="layui-table" id="productinfo_table" lay-filter="productinfo_tableFilter"></table>
              </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格---图片 --%>
<script type="text/html" id="productinfo_img">
  <div>
    <img width="60" height="60" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
  </div>
</script>

<%-- 表格---操作 --%>
<script type="text/html" id="productinfo_bar">
    <span class="layui-btn layui-btn-xs" lay-event="echo">回传商品信息</span>
</script> 

<script src="${ctx}/static/js/customer/dabao/productinfo.js"></script>