<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>描述过滤词</title>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shop_descProhabitWord_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block disflex">
                  <select
                    id="shop_descProhabitWord_site_sel"
                    name="salesSite"
                    lay-search
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">过滤词中文</label>
                <div class="layui-input-block disflex">
                  <input
                    type="text"
                    name="prohibitWord"
                    class="layui-input"
                    placeholder="模糊搜索"
                  />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">过滤词英文</label>
                <div class="layui-input-block disflex">
                  <input
                    type="text"
                    name="prohibitWordEn"
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
                    id="shop_descProhabitWord_search"
                    >查询</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-primary"
                    type="reset"
                    id="shop_descProhabitWord_reset"
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
          <div class="layui-tab" lay-filter="shop_descProhabitWord_tab">
            <div class="disflex">
              <ul class="layui-tab-title">
                <li class="layui-this">
                  数量(<span id="shop_descProhabitWord_total">0</span>)
                </li>
              </ul>
              <div
                class="ml20 disFCenter"
                style="flex: 1;"
              >
                <div><a
                  href="javascript:;"
                  class="layui-btn layui-btn-danger layui-btn-sm"
                  id="shop_descProhabitWord_batch_del"
                  >批量删除</a
                ></div>
                <div><a
                  href="javascript:;"
                  class="layui-btn layui-btn-sm"
                  id="shop_descProhabitWord_add"
                  >新增</a
                ></div>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table
                  class="layui-table"
                  id="shop_descProhabitWord_table"
                  lay-filter="shop_descProhabitWord_table"
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
<script type="text/html" id="shop_descProhabitWord_toolbar">
  <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="edit">编辑</a
  ><a
    href="javascript:;"
    class="layui-btn layui-btn-sm layui-btn-danger"
    lay-event="del"
    >删除</a
  >
</script>

<!-- 编辑弹窗 -->
<script type="text/html" id="shop_descProhabitWord_editModal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="shop_descProhabitWord_edit_form">
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"><font class="fRed">*</font>站点</label>
            <div class="layui-input-block">
              <select
                id="shop_descProhabitWord_editModal_site_sel"
                name="salesSite"
                lay-search
              ></select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"><font class="fRed">*</font>过滤词中文</label>
            <div class="layui-input-block">
              <input type="text" name="prohibitWord" class="layui-input"/>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"><font class="fRed">*</font>过滤词英文</label>
            <div class="layui-input-block">
              <input type="text" name="prohibitWordEn" class="layui-input"/>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/publishs/shopee/descProhibitWord.js"></script>
