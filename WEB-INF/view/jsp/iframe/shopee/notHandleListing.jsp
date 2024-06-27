<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>不处理Listing</title>
<style></style>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg15 layui-col-md15">
      <!-- 搜索条件 -->
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shopee_not_handle_listing_form" lay-filter="shopee_not_handle_listing_form">
            <div class="layui-form-item">
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select id="shopee_not_handle_listing_depart" lay-search lay-filter="shopee_not_handle_listing_depart" class="orgs_hp_custom">
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">销售人员</label>
                <div class="layui-input-block">
                  <select lay-search class="users_hp_custom" data-rolelist="shopee专员" id="shopee_not_handle_listing_salesman" lay-filter="shopee_not_handle_listing_salesman">
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select
                    xm-select="shopee_not_handle_listing_store"
                    id="shopee_not_handle_listing_store"
                    xm-select-search
                    class="store_hp_custom"
                    data-platcode="shopee"
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    name="storeAcctIdList"
                  >
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">添加时间</label>
                <div class="layui-input-block disflex">
                  <input type="text" class="layui-input" id="shopee_not_handle_listing_addTime" name="createTime">
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">销量</label>
                <div class="layui-input-block disflex">
                  <div>
                    <select name="salesType" lay-filter="shopee_not_handle_listing_salesType">
                      <option value="">请选择</option>
                      <option value="7">7天销量</option>
                      <option value="30">30天销量</option>
                      <option value="60">60天销量</option>
                      <option value="90">90天销量</option>
                    </select>
                  </div>
                  <div class="ml10 hidden">
                    <div class="disflex">
                        <input type="number" class="layui-input" onkeypress="commonKeyPressInputNotNega(event)" name="minSales" />
                        <span class="ml10 mr10">-</span>
                        <input type="number" class="layui-input" onkeypress="commonKeyPressInputNotNega(event)" name="maxSales" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">item_id</label>
                <div class="layui-input-block">
                  <input type="text" name="itemIdList" class="layui-input shopee-not-handle-listing-list-blur" placeholder="支持多个item_id,英文逗号分割" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品父sku</label>
                <div class="layui-input-block">
                  <input type="text" name="prodPSkuList" class="layui-input shopee-not-handle-listing-listNotNumber-blur" placeholder="支持多个商品父sku,英文逗号分割" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">不处理类型</label>
                <div class="layui-input-block">
                  <select name="filterType">
                    <option value="">请选择</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label labelSel">
                  <select name="effectQueryType">
                    <option value="0">浏览量</option>
                    <option value="1">收藏量</option>
                    <option value="2">历史销量</option>
                  </select>
                </label>
                <div class="layui-input-block disflex">
                  <input type="number" class="layui-input" name="minEffect" />
                  <span class="ml10 mr10">-</span>
                  <input type="number" class="layui-input" name="maxEffect" />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">库存</label>
                <div class="layui-input-block disflex">
                  <div>
                    <select name="stockQueryType" lay-filter="shopee_not_handle_listing_stockType">
                      <option value="">请选择</option>
                      <option value="0">活动总库存</option>
                      <option value="1">normal总库存</option>
                      <option value="2">shopee总库存</option>
                      <option value="3">义乌仓可用库存合计(不含在途)</option>
                      <option value="4">自建南宁仓可用库存(不含在途)</option>
                    </select>
                  </div>
                  <div class="ml10 hidden">
                    <div class="disflex">
                        <input type="number" class="layui-input" onkeypress="commonKeyPressInputInt(event)" name="minStock" />
                        <span class="ml10 mr10">-</span>
                        <input type="number" class="layui-input" onkeypress="commonKeyPressInputInt(event)" name="maxStock" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label" style="width: 90px; padding: 9px 5px;">在线listing标签</label>
                <div class="layui-input-block">
                    <select name="listingTagIdList"
                        xm-select="shopee_not_handle_listing_listingTagList"
                        lay-filter="shopee_not_handle_listing_listingTagList"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">variantion_id</label>
                <div class="layui-input-block">
                  <input type="text" name="variantionIds" class="layui-input shopee-not-handle-listing-list-blur" placeholder="支持多个variantion_id,英文逗号分割" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20" id="shopee_not_handle_listing_search">查询</a>
                <a href="javascript:void(0);" type="reset" class="layui-btn layui-btn-primary layui-btn-sm ml20" id="shopee_not_handle_listing_reset">清空</a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- 表格内容  -->
      <div class="layui-card">
        <div class="layui-card-header disFCenter toFixedContain">
          <div class="disFCenter">
            <div>数量(共<span id="shopee_not_handle_listing_total">0</span>条)</div>
            <a href="javascript:void(0);" class="layui-btn layui-btn-danger layui-btn-sm ml20" id="shopee_not_handle_listing_batch_del">批量删除</a>
          </div>
          <form class="layui-form disflex" id="shopee_not_handle_listing_add_form">
            <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20" id="shopee_not_handle_listing_export">导出</a>
            <div>
              <label class="layui-form-label"> <font class="fRed">*</font>不处理类型 </label>
              <div class="layui-input-block">
                <select name="filterType" lay-filter="shopee_not_handle_listing_filterType"></select>
              </div>
            </div>
            <input type="text" class="layui-input w200 inline_block shopee-not-handle-listing-list-blur ml20" placeholder="支持多个item_id,英文逗号分割" name="itemIdList" />
            <input type="text" class="layui-input w200 inline_block shopee-not-handle-listing-list-blur ml20" placeholder="支持多个variantion_id,英文逗号分割" name="variantionIds" readonly />
            <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20" id="shopee_not_handle_listing_add">新增</a>
          </form>
        </div>
        <div class="layui-card-body">
          <table class="layui-table" id="shopee_not_handle_listing_table" lay-filter="shopee_not_handle_listing_table"></table>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/html" id="shopee_not_handle_listing_toolbar">
  <a href="javascript:void(0);" class="layui-btn  layui-btn-danger layui-btn-sm ml20" lay-event="del">删除</a>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/notHandleListing.js"></script>
