<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>类目必填项</title>
<style>
  .w170 {
    width: 170px;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shop_categoryRequired_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">默认值</label>
                <div class="layui-input-block disflex">
                  <select name="defaultValue"
                    lay-search
                  >
                  <option value="0">无</option>
                  <option value="1">有</option>
              </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">属性名</label>
                <div class="layui-input-block disflex">
                  <input
                    type="text"
                    name="displayAttributeName"
                    class="layui-input"
                    placeholder="模糊搜索"
                  />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm"
                    id="shop_categoryRequired_search"
                    >查询</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-primary"
                    type="reset"
                    id="shop_categoryRequired_reset"
                    >清空</a
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="shop_categoryRequired_tab">
            <div class="disflex">
              <ul class="layui-tab-title">
                <li class="layui-this">
                  数量(<span id="shop_categoryRequired_total">0</span>)
                </li>
              </ul>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table
                  class="layui-table"
                  id="shop_categoryRequired_table"
                  lay-filter="shop_categoryRequired_table"
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--  -->
<script type="text/html" id="shop_categoryRequired_toolbar">
  <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="edit"
    >修改</a
  >
</script>

<script type="text/html" id="shop_categoryRequired_editModal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form">
        <div class="layui-form-item attrs"></div>
        <div class="layui-form-item attrsUnit">
          <label class="layui-form-label w170">unit(单位)</label>
          <div class="layui-input-block ml200">
            <select name="defaultValueUnit" id="shop_categoryRequired_unit"></select>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/publishs/shopee/categoryRequired.js"></script>
