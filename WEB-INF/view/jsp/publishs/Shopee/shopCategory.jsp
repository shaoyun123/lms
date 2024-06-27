<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>店铺类目</title>
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shop_shopCate_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select
                    lay-filter="orgs_hp_shop_shopCate"
                    lay-search
                    class="orgs_hp_custom"
                  ></select>
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                  <select
                    class="users_hp_custom"
                    lay-search
                    data-rolelist="shopee专员"
                    lay-filter="users_hp_shop_shopCate"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block disflex">
                  <select id="shop_shopCate_form_store" name="storeAcctIds" lay-filter="shop_shopCate_form_store"
                    xm-select="shop_shopCate_form_store" class="users_hp_store_multi" xm-select-search 
                    xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee">
                  </select>
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_syncShopCate"
                    >同步店铺类目</a
                  >
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block disflex">
                  <select
                    id="shop_shopCate_site_sel"
                    lay-filter="shop_shopCate_site_sel"
                    class="salesSite_hp_custom"
                    name="salesSite"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">类目状态</label>
                <div class="layui-input-block">
                  <select name="shopCategoryStatus" lay-search>
                    <option value="">请选择</option>
                    <option value="1">已开启</option>
                    <option value="0">已关闭</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">店铺类目</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    class="layui-input"
                    name="shopCategoryName"
                  />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">商品数量</label>
                <div class="layui-input-block disflex">
                  <input
                    type="text"
                    class="layui-input"
                    name="minCount"
                    min="0"
                    onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                    class="layui-input"
                  />
                  <input
                    type="text"
                    class="layui-input"
                    name="maxCount"
                    min="0"
                    onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                    class="layui-input"
                  />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_search"
                    >查询</a
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="shop_shopCate_tab">
            <div class="disflex">
              <ul class="layui-tab-title">
                <li class="layui-this">
                  数量(<span id="shop_shopCate_total">0</span>)
                </li>
              </ul>
              <div class="disFCenter ml20" style="flex: 1">
                <div>
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_batch_on"
                    >批量开启</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_batch_off"
                    >批量关闭</a
                  >
                </div>
                <div>
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_export"
                    >导出</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_download_tpl"
                    >下载模板</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_shopCate_import"
                    >导入新建</a
                  >
                </div>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table
                  class="layui-table"
                  id="shop_shopCate_table"
                  lay-filter="shop_shopCate_table"
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="shop_shopCate_toolbar">
  <a
    href="javascript:;"
    class="layui-btn layui-btn-sm layui-btn-normal"
    lay-event="edit"
    >编辑</a
  >
  {{# if(d.sortWeight!=-1){ }}
  <a
    href="javascript:;"
    class="layui-btn layui-btn-sm layui-btn-danger"
    lay-event="del"
    >删除</a
  >
  {{# } }}
</script>

<!-- 编辑弹窗 -->
<script type="text/html" id="shop_shopCate_editModal">
  <div class="layui-card">
    <div class="layui-card-header">店铺类目</div>
    <div class="layui-card-body">
      <form action="" class="layui-form" id="shop_shopCate_editForm">
        <input type="number" name="id" value="{{d.id}}" hidden />
        <div class="layui-form-item">
          <label class="layui-form-label"
            ><font class="fRed">*</font>店铺类目</label
          >
          <div class="layui-input-block">
            <input
              type="text"
              class="layui-input"
              name="shopCategoryName"
              value="{{d.shopCategoryName}}"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"
            ><font class="fRed">*</font>排序</label
          >
          <div class="layui-input-block">
            <input
              type="number"
              class="layui-input"
              name="sortWeight"
              value="{{d.sortWeight}}"
              min="1"
              onkeyup="shopeeShopCategory_testNum(this.value,event)"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">状态</label>
          <div class="layui-input-block disFCenter">
            <div>
              <input type="radio" value="1" title="启用" class="layui-input"
              name="shopCategoryStatus" {{d.shopCategoryStatus != undefined &&
              d.shopCategoryStatus==1 && 'checked'}}> <input type="radio"
              value="0" title="停用" class="layui-input"
              name="shopCategoryStatus" {{d.shopCategoryStatus != undefined &&
              d.shopCategoryStatus==0 && 'checked'}}>
            </div>
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal"
              id="shop_shopCate_edit_change"
              >修改</a
            >
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="layui-card">
    <div class="layui-card-header">店铺商品</div>
    <div class="layui-card-body">
      <form action="" class="layui-form" id="shop_shopCate_edit_itemIdForm">
        <div class="layui-form-item">
          <label class="layui-form-label">已有itemId</label>
          <div class="layui-input-block">
            <textarea
              name="itemIdList"
              class="layui-textarea layui-disabled"
              disabled
              id="shop_shopCate_edit_itemIdList"
            ></textarea>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">添加itemId</label>
          <div class="layui-input-block disflex">
            <input
              type="text"
              class="layui-input"
              name="addItemId"
              id="shop_shopCate_edit_add"
              onblur="shopeeShopCategory_itemIdBlur(this.value,event)"
            />
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal ml10"
              id="shop_shopCate_edit_addBtn"
              value=""
              >添加</a
            >
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">移除itemId</label>
          <div class="layui-input-block disflex">
            <input
              type="text"
              class="layui-input"
              name="delItemId"
              id="shop_shopCate_edit_del"
              onblur="shopeeShopCategory_itemIdBlur(this.value,event)"
            />
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal ml10"
              id="shop_shopCate_edit_delBtn"
              value=""
              >移除</a
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/publishs/shopee/shopCategory.js"></script>
