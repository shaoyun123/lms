<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>入库单管理</title>

<style>
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                  <form class="layui-form" id="orderstorageSearchForm">
                    <div class="layui-form-item">
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">货主</label>
                          <div class="layui-input-block">
                              <select name="ownerUserId" 
                              lay-search 
                              id="orderstorage_ownerUserId"
                              lay-filter="orderstorage_ownerUserId"
                              >
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">计划单号</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="orderCode">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">SKU</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="skuList">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">商品ID</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="itemId">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">创建时间</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="times" id="orderstorage_times" readonly>
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
                          <label class="layui-form-label">上架状态</label>
                          <div class="layui-input-block">
                              <select name="putawayStatus" lay-search>
                                  <option value="">全部</option>
                                  <option value="1">已上架</option>
                                  <option value="0">未上架</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2" style="padding-left: 2%;box-sizing: border-box;line-height: 32px;">
                        <span class="layui-btn layui-btn-sm" lay-filter="orderstorageSearch"  lay-submit>
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
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="orderstorage_push">上架</span>
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="orderstorage_echo">回传</span>
                </div>
              </div>
              <div class="layui-card-body">
                <table class="layui-table" id="orderstorage_table" lay-filter="orderstorage_tableFilter"></table>
              </div>
            </div>
        </div>
    </div>
</div>


<%-- 表格---计划单号 --%>
<script type="text/html" id="orderstorage_orderCode">
  <span lay-event="detail" style="color:#1e9fff;cursor:pointer;">{{d.orderCode || ''}}</span>
</script>

<%-- 表格---业务类型 --%>
<script type="text/html" id="orderstorage_bizType">
 <div>
  {{# if(d.bizType == 10){  }}
  <span>3PL</span>
  {{# }else if(d.bizType == 20){  }}
  <span>4PL</span>
  {{# }else{  }}
  <span></span>
  {{# } }}
 </div>
</script>
<%-- 表格---操作 --%>
<script type="text/html" id="orderstorage_bar">
  <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="echo">回传</span>
  <span class="layui-btn layui-btn-xs" lay-event="push">上架</span>
</script>

<%-- 弹框-详情 --%>
<script type="text/html" id="orderstorage_detailLayer">
  <div style="padding:20px;">
    <table class="layui-table">
      <thead>
        <tr>
          <th>商品图片</th>
          <th>商品ID</th>
          <th>商品编码</th>
          <th>商品名称</th>
          <th>发货数量</th>
        </tr>
      </thead>
      <tbody id="orderstorage_detail_tbody"></tbody>
    </table>
  </div>
</script>

<script src="${ctx}/static/js/customer/dabao/orderstorage.js"></script>