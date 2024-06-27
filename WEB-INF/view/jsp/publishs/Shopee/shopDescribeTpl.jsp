<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>店铺描述模板</title>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shop_shopDescribeTpl_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select lay-filter="orgs_hp_shop_shopDescribeTpl" lay-search class="orgs_hp_custom" name="org"></select>
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                  <select class="users_hp_custom" lay-search data-rolelist="shopee专员" lay-filter="users_hp_shop_shopDescribeTpl" name="saleman"></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select id="shop_shopDescribeTpl_form_store" name="storeAcctIds" lay-filter="shop_shopDescribeTpl_form_store"
                    xm-select="shop_shopDescribeTpl_form_store" class="users_hp_store_multi" xm-select-search 
                    xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block disflex">
                  <select id="shop_shopDescribeTpl_site_sel" lay-filter="shop_shopDescribeTpl_site_sel" class="salesSite_hp_custom" name="salesSite"></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label labelSel">
                  <select name="personType" lay-filter="shop_shopDescribeTpl_personType">
                    <option value="creators">创建人</option>
                    <option value="modifiers">修改人</option>
                  </select>
                </label>
                <div class="layui-input-block">
                  <select name="personName" lay-search id="shop_shopDescribeTpl_personName" xm-select="shop_shopDescribeTpl_personName"  xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label labelSel">
                  <select name="timeType">
                    <option value="creatTime">创建时间</option>
                    <option value="modifierTime">修改时间</option>
                  </select>
                </label>
                <div class="layui-input-block">
                  <input id="shop_shopDescribeTpl_time" class="layui-input" name="time"  autocomplete="off"/>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <a href="javascript:;" class="layui-btn layui-btn-sm" id="shop_shopDescribeTpl_search">查询</a>
                  <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary" type="reset" id="shop_shopDescribeTpl_reset">清空</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="shop_shopDescribeTpl_tab">
            <div class="disflex">
              <ul class="layui-tab-title">
                <li class="layui-this">数量(<span id="shop_shopDescribeTpl_total">0</span>)</li>
              </ul>
              <div class="ml20 disflex" style="flex: 1; justify-content: flex-end">
                <a href="javascript:;" class="layui-btn layui-btn-sm" id="shop_shopDescribeTpl_batch_export">导出模板</a>
                <a href="javascript:;" class="layui-btn layui-btn-sm" id="shop_shopDescribeTpl_batch_import">导入修改</a>
                <a href="javascript:;" class="layui-btn layui-btn-sm ml10" id="shop_shopDescribeTpl_batch_edit">批量编辑</a>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table class="layui-table" id="shop_shopDescribeTpl_table" lay-filter="shop_shopDescribeTpl_table"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--  -->
<script type="text/html" id="shop_shopDescribeTpl_toolbar">
  <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="edit">编辑</a>
</script>

<!-- 编辑弹窗 -->
<script type="text/html" id="shop_shopDescribeTpl_editModal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="shop_shopDescribeTpl_edit_form">
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">描述头</label>
            <div class="layui-input-block">
              <textarea name="descrHeader" placeholder="请输入" class="layui-textarea" rows="10"></textarea>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">描述尾</label>
            <div class="layui-input-block">
              <textarea name="descrTail" placeholder="请输入" class="layui-textarea" rows="10"></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script type="text/html" id="shop_shopDescribeTpl_export_result">
  <table
    class="layui-table"
    id="shop_shopDescribeTpl_export_result_Table"
  ></table>
</script>

<script src="${ctx}/static/js/publishs/shopee/shopDescribeTpl.js"></script>
